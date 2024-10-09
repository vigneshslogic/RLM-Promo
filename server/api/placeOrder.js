import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/commerce/sales-orders/actions/place`;
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
              Name: "Test Order",
              EffectiveDate: "2024-02-01",
              Pricebook2Id: "01sPv000001FdriIAC",
              Status: "Draft",
              BillingCity: body?.user?.city?.value,          // Billing city
              BillingCountry: body?.user?.state?.value,                 // Billing country
              BillingState: body?.user?.state?.value,                    // Billing state
              BillingStreet: body?.user?.address?.value,        // Billing street
              BillingPostalCode: body?.user?.pincode?.value,            // Billing postal code
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
          PricebookEntryId: product?.priceBookEntryId,
          Product2Id: product?.id,
          ListPrice: product?.price,
          UnitPrice: product?.price,
          NetUnitPrice: product?.price,
          PeriodBoundary: "Anniversary", // product?.periodBoundary,
          ServiceDate: "2024-02-01",
        },
      };

      if (product?.periodBoundary !== 'OneTime') {
        const date = new Date('2024-02-01');  // Convert to Date object
        date.setMonth(date.getMonth() + 12);
        date.setDate(date.getDate() - 1); // Add months using date-fns
        const endDate = date.toISOString().split('T')[0];

        prod.record = {
          ...prod.record,
          EndDate: endDate,
          PricingTermCount: 12.0,
          TotalLineAmount: 12 * (product?.price),
          BillingFrequency2: product?.periodBoundary,
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
