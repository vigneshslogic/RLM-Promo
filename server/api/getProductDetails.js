import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 

  try {
    const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/connect/cpq/products/${body.product}`;
    const response = await axios.post(url, {
        "priceBookId": "01sPv000001FdriIAC"
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
    console.error('Error fetching Salesforce token:', error.response ? error.response.data : error.message);
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});