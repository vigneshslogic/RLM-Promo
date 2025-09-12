import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/query/?q=SELECT Id, Name, Show_in_Webshop__c FROM ProductCatalog WHERE Show_in_Webshop__c = true ORDER BY Name ASC LIMIT 50`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response?.data?.done === true) {
      return response.data;
    }
    
    return false;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});