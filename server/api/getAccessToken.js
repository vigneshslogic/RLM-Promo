import axios from 'axios';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const tokenUrl = `${config.api_endpoint}/services/oauth2/token`;

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.salesforceClientId,
        client_secret: config.salesforceClientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});
