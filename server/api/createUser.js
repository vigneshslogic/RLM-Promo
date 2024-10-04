import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const instanceURL = 'https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v58.0/sobjects';

    // const accountData = {
    //   Name: 'Dev-testing',
    //   Type: 'Customer', // Optional: specify account type if needed
    // };

    // const accountResponse = await axios.post(`${instanceURL}/account/`, accountData, {
    //   headers: {
    //     Authorization: `Bearer ${body.accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    if (body.user) {
      // body.contactData.AccountId = accountResponse.data?.id; // Associate contact with the newly created account
      body.user.AccountId = '001Pv00000XN9R1IAL';

      const contactResponse = await axios.post(`${instanceURL}/Contact/`, body.user, {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (contactResponse) {
        return {
          accountId: '001Pv00000XN9R1IAL',
          contactId: contactResponse.data.id,
        };
      }
    }

    return { accountId: accountResponse.data.id };

    // return response.data;
  } catch (error) {
    throw createError({
      statusCode: error.response ? error.response.status : 500,
      message: error.response ? error.response.data.error_description : error.message,
    });
  }
});
