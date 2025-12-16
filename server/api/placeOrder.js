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
                            AccountId: body?.accountId, // define user accountId here
                            BillToContactId: body?.contactId,
                            Name: `${body?.userName} - ${productNames}`, // make it with {{user}}-{{product_name}}
                            EffectiveDate: today.toISOString().split('T')[0],
                            Pricebook2Id: `${config?.pricebook_id}`,
                            Source__c: "WebStore",
                            Status: "Draft",
                            AutoRenewal__c: body?.user?.autoRenewal?.value,
                            BillingCity: body?.user?.city?.value,          // Billing city
                            BillingCountry: body?.user?.state?.value,                 // Billing country
                            BillingState: body?.user?.state?.value,                    // Billing state
                            BillingStreet: body?.user?.address?.value,        // Billing street
                            BillingPostalCode: body?.user?.pincode?.value,            // Billing postal code
                            ShippingCity: body?.user?.city?.value,          // Shipping city
                            ShippingCountry: body?.user?.state?.value,                 // Shipping country
                            ShippingState: body?.user?.state?.value,                    // Shipping state
                            ShippingStreet: body?.user?.address?.value,        // Shipping street
                            ShippingPostalCode: body?.user?.pincode?.value,            // Shipping postal code
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

        body.products?.forEach((product, index) => {
            const orderItemRefId = `refOrderItem${index > 0 ? index : ''}`;
            
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

            if (product?.periodBoundary !== 'OneTime') {
              if (product?.pricingModelType !== 'Evergreen') {
                const date = new Date(`${today.toISOString().split('T')[0]}`); 
                date.setMonth(date.getMonth() + 12);
                date.setDate(date.getDate() - 1);
                const endDate = date.toISOString().split('T')[0];
                orderItem.record = {
                        ...orderItem.record,
                        EndDate: endDate,
                    }
              }

                orderItem.record = {
                    ...orderItem.record,
                    PricingTermCount: 12.0,
                    TotalLineAmount: 12 * (product?.price),
                    BillingFrequency2: product?.periodBoundary === 'Months' ? 'Monthly' : product?.periodBoundary,
                }
            }
            
            productRecords.push(orderItem);

            if (product.selectedAttribute && product.selectedAttribute != null) {
                const attributeRefId = `refOrderItemAttribute${attributeRefCounter++}`;
                
                const attributeRecord = {
                    referenceId: attributeRefId,
                    record: {
                        attributes: {
                            type: "OrderItemAttribute",
                            method: "POST",
                        },
                        OrderItemId: `@{${orderItemRefId}.id}`,
                        AttributeValue: product.selectedAttribute.code, 
                        AttributeDefinitionId: product.selectedAttribute.definitionId, 
                        AttributePicklistValueId: product.selectedAttribute.picklistValueId, 
                    },
                };
                productRecords.push(attributeRecord);
            }
        });

        if (productRecords?.length) {
            rawPayload.graph.records = rawPayload?.graph?.records.concat(productRecords);

            const response = await axios.post(url, rawPayload, {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201 || response.status === 200) {
                try {
                    // store user billing/ shipping addresses
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
                    console.error("Error updating account address:", error); //continue with the execution
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
                    // make order activate after the order place immediately
                    const activeUrl = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/sobjects/Order/${response.data?.orderId}`;
                    await axios.patch(activeUrl, { Status: "Activated" }, {
                        headers: {
                            Authorization: `Bearer ${body.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
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