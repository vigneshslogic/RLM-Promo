import axios from "axios";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    try {
        const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/commerce/sales-orders/actions/place`;

        const productNames = body?.products?.map(product => product.name)?.join('-');
        let today = new Date();

        let rawPayload = {
            pricingPref: "System",
            configurationInput: "RunAndAllowErrors",
            configurationOptions: {
                validateProductCatalog: false,
                validateAmendRenewCancel: false,
                executeConfigurationRules: false,
                addDefaultConfiguration: false,
            },
            graph: {
                graphId: "1",
                records: [
                    {
                        referenceId: "refOrder",
                        record: {
                            attributes: {
                                type: "Order",
                                method: "POST",
                            },
                            AccountId: body?.accountId,
                            BillToContactId: body?.contactId,
                            Name: `${body?.userName} - ${productNames}`,
                            EffectiveDate: today.toISOString().split('T')[0],
                            Pricebook2Id: `${config?.pricebook_id}`,
                            Status: "Draft",
                            BillingCity: body?.user?.city?.value,
                            BillingCountry: body?.user?.state?.value,
                            BillingState: body?.user?.state?.value,
                            BillingStreet: body?.user?.address?.value,
                            BillingPostalCode: body?.user?.pincode?.value,
                            ShippingCity: body?.user?.city?.value,
                            ShippingCountry: body?.user?.state?.value,
                            ShippingState: body?.user?.state?.value,
                            ShippingStreet: body?.user?.address?.value,
                            ShippingPostalCode: body?.user?.pincode?.value,
                        },
                    },
                    {
                        referenceId: "refOrderAction",
                        record: {
                            attributes: {
                                type: "OrderAction",
                                method: "POST",
                            },
                            OrderId: "@{refOrder.id}",
                            Type: "Add",
                        },
                    },
                    {
                        referenceId: "refAppUsageAssign",
                        record: {
                            attributes: {
                                type: "AppUsageAssignment",
                                method: "POST",
                            },
                            RecordId: "@{refOrder.id}",
                            AppUsageType: "RevenueLifecycleManagement",
                        },
                    },
                ],
            },
        };

        const productRecords = [];
        let attributeRefCounter = 0;

        // 1. Define products eligible for splitting
        const SPLIT_PRODUCTS = [
            "Business Insider", 
            "AD Digital", 
            "VK Saturday Plus", 
            "National Geographic"
        ];

        body.products?.forEach((product, index) => {
            // 2. Determine if this specific product should be split
            const isSplitProduct = SPLIT_PRODUCTS.includes(product?.name);
            
            // If split product: iterate twice (0, 1). If regular: iterate once (0).
            const iterations = isSplitProduct ? [0, 1] : [0];

            iterations.forEach((splitIndex) => {
                // Generate unique reference ID depending on split status
                // If regular: refOrderItem0. If split: refOrderItem0_0, refOrderItem0_1
                const suffix = isSplitProduct ? `_${splitIndex}` : '';
                const orderItemRefId = `refOrderItem${index}${suffix}`;
                
                let orderItem = {
                    referenceId: orderItemRefId,
                    record: {
                        attributes: {
                            type: "OrderItem",
                            method: "POST",
                        },
                        OrderId: "@{refOrder.id}",
                        OrderActionId: "@{refOrderAction.id}",
                        Quantity: product?.quantity,
                        priceBookEntryId: product?.priceBookEntryId, 
                        Product2Id: product?.id,
                        ListPrice: product?.listPrice || product?.price,
                        UnitPrice: product?.price,
                        NetUnitPrice: product?.price,
                        Discount: parseFloat(
                                    ((body?.user?.discount || 0) / (body?.products?.length || 1)).toFixed(2)
                                ),
                        PeriodBoundary: "Anniversary", 
                        ServiceDate: today.toISOString().split('T')[0],
                    },
                };

                // --- 3. Date Logic ---

                if (isSplitProduct) {
                    // Logic for SPLIT PRODUCTS
                    const startDate = new Date(today);
                    const endDate = new Date(today);

                    if (splitIndex === 0) {
                        // PART 1: Today to 6 Months
                        orderItem.record.ServiceDate = startDate.toISOString().split('T')[0];
                        
                        // Add EndDate if NOT Evergreen
                        if (product?.pricingModelType !== 'Evergreen') {
                            endDate.setMonth(endDate.getMonth() + 6);
                            // endDate.setDate(endDate.getDate() - 1); // Optional: Standard -1 day logic, enable if needed
                            //orderItem.record.EndDate = endDate.toISOString().split('T')[0];
                        }
                    } else {
                        // PART 2: 6 Months to 12 Months (or indefinite)
                        startDate.setMonth(startDate.getMonth() + 6);
                        orderItem.record.ServiceDate = startDate.toISOString().split('T')[0];

                        // Add EndDate if NOT Evergreen
                        if (product?.pricingModelType !== 'Evergreen') {
                            endDate.setMonth(endDate.getMonth() + 12);
                            // endDate.setDate(endDate.getDate() - 1); // Optional: Standard -1 day logic
                            //orderItem.record.EndDate = endDate.toISOString().split('T')[0];
                        }
                    }
                } else {
                    // Logic for REGULAR PRODUCTS (Existing Logic)
                    if (product?.periodBoundary !== 'OneTime') {
                        if (product?.pricingModelType !== 'Evergreen') {
                            const date = new Date(today); 
                            date.setMonth(date.getMonth() + 12);
                            date.setDate(date.getDate() - 1);
                            orderItem.record.EndDate = date.toISOString().split('T')[0];
                        }
                    }
                }

                // --- 4. Term & Amount Logic (Applied to all items that are not OneTime) ---
                if (product?.periodBoundary !== 'OneTime') {
                    orderItem.record = {
                        ...orderItem.record,
                        PricingTermCount: 12.0,
                        TotalLineAmount: 12 * (product?.price),
                        BillingFrequency2: product?.periodBoundary === 'Months' ? 'Monthly' : product?.periodBoundary,
                    };
                }
                
                productRecords.push(orderItem);

                // --- 5. Attribute Logic (Duplicated for split items) ---
                if (product.selectedAttribute && product.selectedAttribute != null) {
                    const attributeRefId = `refOrderItemAttribute${attributeRefCounter++}`;
                    
                    const attributeRecord = {
                        referenceId: attributeRefId,
                        record: {
                            attributes: {
                                type: "OrderItemAttribute",
                                method: "POST",
                            },
                            // Dynamically link to the current OrderItem (split or regular)
                            OrderItemId: `@{${orderItemRefId}.id}`,
                            AttributeValue: product.selectedAttribute.code, 
                            AttributeDefinitionId: product.selectedAttribute.definitionId, 
                            AttributePicklistValueId: product.selectedAttribute.picklistValueId, 
                        },
                    };
                    productRecords.push(attributeRecord);
                }
            });
        });

        if (productRecords?.length) {
            rawPayload.graph.records = rawPayload?.graph?.records.concat(productRecords);
            //console.log("Final Payload Records:", rawPayload.graph.records);

            const response = await axios.post(url, rawPayload, {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201 || response.status === 200) {
                try {
                    // Update user billing/shipping addresses
                    const addressURL = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/sobjects/Account/${body?.accountId}`;
                    await axios.patch(addressURL, {
                        BillingCity: body?.user?.city?.value,
                        BillingCountry: body?.user?.state?.value,
                        BillingState: body?.user?.state?.value,
                        BillingStreet: body?.user?.address?.value,
                        BillingPostalCode: body?.user?.pincode?.value,
                        ShippingCity: body?.user?.city?.value,
                        ShippingCountry: body?.user?.state?.value,
                        ShippingState: body?.user?.state?.value,
                        ShippingStreet: body?.user?.address?.value,
                        ShippingPostalCode: body?.user?.pincode?.value,
                    }, {
                        headers: {
                            Authorization: `Bearer ${body.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error("Error updating account address:", error);
                }

                try {
                    const orderurl = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/query/?q=SELECT Id, OrderNumber, Status from Order where Id = '${response.data?.orderId}'`;
                    const responseOrder = await axios.get(orderurl, {
                        headers: {
                            Authorization: `Bearer ${body?.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                    
                    if (responseOrder?.data?.records?.length) {
                        const orderRecord = responseOrder.data.records[0];
                        response.data.OrderNumber = orderRecord.OrderNumber;
                        response.data.Status = orderRecord.Status;
                    }
                    
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        console.error("Order activation failed (400):", JSON.stringify(error.response.data, null, 2));
                    } else {
                        console.error("Order activation error:", error);
                    }
                }
                return response.data;
            }
        }

        return false;
    } catch (error) {
        throw createError({
            statusCode: error.response ? error.response.status : 500,
            message: error.response
                ? error.response.data.error_description || "An unexpected error occurred during order placement."
                : error.message,
        });
    }
});