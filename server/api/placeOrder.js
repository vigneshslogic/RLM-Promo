import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/commerce/sales-orders/actions/place`;

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
              Pricebook2Id: "01sPv000001FdriIAC",
              Source__c: "WebStore",
              Status: "Draft",
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

    const products = body.products?.map((product, index) => {
      let prod = {
        referenceId: `refOrderItem${index > 0 ? index : ''}`,
        record: {
          attributes: {
            type: "OrderItem",
            method: "POST",
          },
          OrderId: "@{refOrder.id}",
          OrderActionId: "@{refOrderAction.id}",
          Quantity: 1,
          priceBookEntryId: product?.priceBookEntryId,
          Product2Id: product?.id,
          ListPrice: product?.price,
          UnitPrice: product?.price,
          NetUnitPrice: product?.price,
          PeriodBoundary: "Anniversary",
          ServiceDate: today.toISOString().split('T')[0],
        },
      };

      if (product?.periodBoundary !== 'OneTime') {
        const date = new Date(`${today.toISOString().split('T')[0]}`); 
        date.setMonth(date.getMonth() + 12);
        date.setDate(date.getDate() - 1);
        const endDate = date.toISOString().split('T')[0];

        prod.record = {
          ...prod.record,
          EndDate: endDate,
          PricingTermCount: 12.0,
          TotalLineAmount: 12 * (product?.price),
          BillingFrequency2: product?.periodBoundary === 'Months' ? 'Monthly' : product?.periodBoundary,
        }
      }


      return prod;
    });

    if (products?.length) {
      rawPayload.graph.records = rawPayload?.graph?.records.concat(products);

      const response = await axios.post(url, rawPayload, {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        try {
          // store user billing/ shipping addresses
          const addressURL = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/sobjects/Account/${body?.accountId}`;
          await axios.patch(activeUrl, {
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

          // make order activate after the order place immediately
          const activeUrl = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/sobjects/Order/${response.data?.orderId}`;
          await axios.patch(activeUrl, { Status: "Activated" }, {
            headers: {
              Authorization: `Bearer ${body.accessToken}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error(error); //continue with the execution
        }
        return response.data;
      }
    }

    return false;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response
        ? error.response.data.error_description
        : error.message,
    });
  }
});
