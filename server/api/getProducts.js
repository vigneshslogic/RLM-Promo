import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${config?.api_version}/connect/cpq/products`;
    let payload = {};
    
    if (!body?.isCategory && body?.catalogId) {
      payload = {
        'correlationId': 'corrId',
        'catalogId': body?.catalogId,
        'priceBookId': `${config?.pricebook_id}`,
      } 
    } else if (body?.isCategory && body?.catalogId) {
      payload = {
        'correlationId': 'corrId',
        'categoryId': body?.catalogId,
        'priceBookId': `${config?.pricebook_id}`,
      } 
    } else {
      payload = {
        'correlationId': 'corrId',
        'priceBookId': `${config?.pricebook_id}`,
      } 
    }

    console.log('payload', payload);

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
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