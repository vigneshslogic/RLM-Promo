import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v60.0/commerce/sales-orders/actions/place`;
    const rawPayload = {
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
              AccountId: "001Pv00000XC7NkIAL", // define user accountId here
              Name: "Test Order",
              EffectiveDate: "2024-02-01",
              Pricebook2Id: "01sPv000001FdriIAC",
              Status: "Draft",
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
          {
            referenceId: "refOrderItem",
            record: {
              attributes: {
                type: "OrderItem",
                method: "POST",
              },
              OrderId: "@{refOrder.id}",
              OrderActionId: "@{refOrderAction.id}",
              Quantity: 1,
              PricebookEntryId: "01uPv000002eJu1IAE", // product?.priceBookEntryId,
              Product2Id: "01tPv000006qWMvIAM", // product?.id,
              ListPrice: 2000.00, // product?.price,
              UnitPrice: 2000.00, // product?.price,
              NetUnitPrice: 2000.00, // product?.price,
              PeriodBoundary: "Anniversary", // product?.periodBoundary,
              ServiceDate: "2024-02-01",
            },
          }
        ],
      },
    };

    // const products = body.products?.map((product) => ({
    //   referenceId: "refOrderItem",
    //   record: {
    //     attributes: {
    //       type: "OrderItem",
    //       method: "POST",
    //     },
    //     OrderId: "@{refOrder.id}",
    //     OrderActionId: "@{refOrderAction.id}",
    //     Quantity: 1,
    //     PricebookEntryId: "01uPv000002eJu1IAE", // product?.priceBookEntryId,
    //     Product2Id: '01tPv000006qWMvIAM', // product?.id,
    //     ListPrice: 2000.00, // product?.price,
    //     UnitPrice: 2000.00, // product?.price,
    //     NetUnitPrice: 2000.00, // product?.price,
    //     PeriodBoundary: "Anniversary", // product?.periodBoundary,
    //     ServiceDate: "2024-02-01",
    //   },
    // }));

    // if (products?.length) {
      // rawPayload?.graph?.records.concat(products);

      const response = await axios.post(url, rawPayload, {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    // }

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
