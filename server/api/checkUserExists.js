import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 
  const config = useRuntimeConfig();

  try {
    const query = `SELECT Id, FirstName, LastName, Email, Phone, Account.Id, Account.Name, Account.BillingStreet, Account.BillingCity, Account.BillingState, Account.BillingPostalCode, Account.BillingCountry, Account.ShippingStreet, Account.ShippingCity, Account.ShippingState, Account.ShippingPostalCode, Account.ShippingCountry FROM Contact WHERE Email='${body.user?.email}'`;
    
    const url = `${config?.api_endpoint}/services/data/v${config?.api_version}/query/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data && !response.data?.totalSize) {
      return false;
    }

    return response.data?.records[0];
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});