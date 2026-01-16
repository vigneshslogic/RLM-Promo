import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const url = `${config?.api_endpoint}/services/data/v${parseFloat(
      config?.api_version
    ).toFixed(1)}/connect/cpq/products`;
    console.log('URL:', url);
    
    let payload = {
      correlationId: 'corrId',
      priceBookId: `${config?.pricebook_id}`,
      additionalFields: {
        Product2: {
          fields: ["IsActive"]
        }
      }
    };


    if (!body?.isCategory && body?.catalogId) {
      payload.catalogId = body.catalogId;
    } else if (body?.isCategory && body?.catalogId) {
      payload.categoryId = body.catalogId;
    }
    console.log('Payload:', payload);
    console.log('Access Token:', body.accessToken);

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      response.data.result = response.data.result.filter(
          (prod) =>
            prod?.additionalFields?.IsActive === true
        );
      return response.data;
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
