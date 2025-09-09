import axios from 'axios';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    try {
        const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/query/?q=SELECT Id, InvoiceNumber, DocumentNumber, InvoiceDate, DueDate, TotalChargeAmountWithTax, Balance from Invoice where BillingAccountId = '${body.accountId}' order by CreatedDate`;

        const response = await axios.get(url,
            {
                headers: {
                    Authorization: `Bearer ${body?.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }
        )

        if (response.status === 200) {
            return response.data;
        }

        return false;

    } catch (error) {
        throw createError({
            statusCode: error.response ? error.response.status : 500,
            message: error.response ? error.response.data.error_description : error.message,
        })
    }
})