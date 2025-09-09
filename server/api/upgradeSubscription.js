import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/actions/standard/initiateAmendment`;
    const payload = body?.payload;

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${body?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      try {
        if (response.data.length) {
          for (const res of response.data) {
            const amendId = res?.outputValues?.amendRecordId;

            if (amendId) {
              const product = body?.other?.to;
              const today = new Date();
              let endDate = today.toISOString().split('T')[0];

              const quoteLineRecord = {
                attributes: {
                  type: 'QuoteLineItem',
                  method: 'POST',
                },
                QuoteId: '@{refQuote.id}',
                PricebookEntryId: body?.other?.plan?.priceBookEntryId,
                Product2Id: product?.id,
                UnitPrice: body?.other?.plan?.price,
                Quantity: body?.other?.qty,
                StartDate: today.toISOString().split('T')[0],
                PeriodBoundary: 'Anniversary',
                ServiceDate: today.toISOString().split('T')[0],
                EndDate: today.toISOString().split('T')[0],
              };

              let plan = body?.other.plan;

              if (plan?.pricingModel?.frequency !== 'OneTime') {
                const date = new Date(today.toISOString().split('T')[0]);
                date.setMonth(date.getMonth() + 12);
                date.setDate(date.getDate() - 1);
                endDate = date.toISOString().split('T')[0];
                quoteLineRecord.EndDate = endDate;

                if (plan?.pricingModel?.frequency === 'Months') {
                  quoteLineRecord.BillingFrequency = 'Monthly';
                } else {
                  quoteLineRecord.BillingFrequency = plan?.pricingModel?.frequency;
                }
              }

              const placeUrl = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/connect/rev/sales-transaction/actions/place`;
              const placePayload = {
                pricingPref: 'System',
                configurationPref: {
                  configurationMethod: 'Skip',
                  configurationOptions: {
                    validateProductCatalog: true,
                    validateAmendRenewCancel: true,
                    executeConfigurationRules: true,
                    addDefaultConfiguration: true,
                  },
                },
                graph: {
                  graphId: 'updateQuote',
                  records: [
                    {
                      referenceId: 'refQuote',
                      record: {
                        attributes: {
                          method: 'PATCH',
                          type: 'Quote',
                          id: amendId,
                        },
                      },
                    },
                    {
                      referenceId: 'refQuoteLine0',
                      record: quoteLineRecord,
                    },
                  ],
                },
              };

              const place = await axios.post(placeUrl, placePayload, {
                headers: {
                  Authorization: `Bearer ${body.accessToken}`,
                  'Content-Type': 'application/json',
                },
              });

              return {
                initiateAmendment: response.data,
                place: place.data,
              };
            }
          }
        }
      } catch (error) {
        throw createError({
          statusCode: 500,
          message: `Error after amendment: ${error.message}`,
        });
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