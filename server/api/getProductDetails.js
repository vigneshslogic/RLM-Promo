import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${config?.api_version}/connect/cpq/products/${body.product}`;
    const response = await axios.post(url, {
      "priceBookId": `${config?.pricebook_id}`,
    }, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data?.result;
    }
    
    return false;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});