import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); 

  try {
    const query = `SELECT Id, FirstName, LastName, Email FROM Contact WHERE Email='${body.user?.email}'`;
    const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v58.0/query/?q=${encodeURIComponent(query)}`;
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