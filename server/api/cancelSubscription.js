import axios from 'axios';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        const url = `https://enterprise-velocity-2370-dev-ed.scratch.my.salesforce.com/services/data/v62.0/actions/standard/initiateCancellation`;

        const payload = body?.payload;

        const response = await axios.post(url, payload,
            {
                headers: {
                    Authorization: `Bearer ${body?.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }
        )

        if (response.status === 200) {
            return response.data;
        }

        return false;

    } catch (error) {
        throw createError({
            statusCode: error.response ? error.response.status : 500,
            message: error.response ? error.response.data.error_description : error.message,
        })
    }
})