import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${config?.api_version}/commerce/quotes/actions/place`;

    const productNames = body?.products?.map(product => product.name)?.join('-');
    let today = new Date();

    let rawPayload = {
        pricingPref: "System",
        configurationInput: "RunAndAllowErrors",
        configurationOptions: {
            validateProductCatalog: false,
            validateAmendRenewCancel: false,
            executeConfigurationRules: false,
            addDefaultConfiguration: false
        },
        graph: {
            graphId: "1",
            records: [
                {
                    referenceId: "refQuote",  
                    record: {
                        attributes: {
                            type: "Quote",
                            method: "POST"
                        },
                        Name: `${body?.userName} - ${productNames}`,
                        Pricebook2Id: `${config?.pricebook_id}`,
                        description: body?.description ?? '',
                        Source__c: "WebStore",
                        ContactId: body?.contactId,
                        BillToContactId: body?.contactId,
                        AccountId__c: body?.accountId
                    }
                },
                {
                    referenceId: "refQuoteAction",
                    record: {
                        attributes: {
                            type: "QuoteAction",
                            method: "POST"
                        },
                        QuoteId: "@{refQuote.id}",
                        Type: "Add"
                    }
                },
                {
                    referenceId: "refAppUsageAssign",
                    record: {
                        attributes: {
                            type: "AppUsageAssignment",
                            method: "POST"
                        },
                        RecordId: "@{refQuote.id}",
                        AppUsageType: "RevenueLifecycleManagement"
                    }
                },
            ]
        }
    };

    const products = body.products?.map((product, index) => ({
        referenceId: `refOrderItem${index > 0 ? index : ''}`,
        record: {
            attributes: {
                type: "QuoteLineItem",
                method: "POST"
            },
            QuoteId: "@{refQuote.id}",
            QuoteActionId: "@{refQuoteAction.id}",
            Quantity: product?.quantity ?? 1,
            priceBookEntryId: product?.priceBookEntryId,
            Product2Id: product?.id,
            UnitPrice: product?.price,
            PeriodBoundary: "Anniversary", // product?.periodBoundary
            ServiceDate: today.toISOString().split('T')[0],
        }
    }));

    
    if (products?.length) {
        rawPayload.graph.records = rawPayload?.graph?.records.concat(products);

        const response = await axios.post(url, rawPayload, {
          headers: {
            Authorization: `Bearer ${body.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 200) {
          return response.data;
        }
    }
    
    return false;

  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});