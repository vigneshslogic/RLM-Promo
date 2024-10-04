import axios from 'axios';

export default defineEventHandler(async (event) => {
  // const body = await readBody(event); 
  const config = useRuntimeConfig();

  const tokenUrl = 'https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/oauth2/token';

  const clientId = config.salesforceClientId;
  const clientSecret = config.salesforceClientSecret;
  const username = config.username;
  const password = config.password;

  try {
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password,
    }));

    return response.data;
  } catch (error) {
    console.error('Error fetching Salesforce token:', error.response ? error.response.data : error.message);
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});