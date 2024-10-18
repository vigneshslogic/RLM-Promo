import axios from 'axios';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    try {
        const url = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/actions/standard/initiateCancellation`;

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
            try {
                // make order activate after the order place immediately
                response.data.foeEach(async(res) => {
                    if (res?.outputValues?.cancelRecordId) {
                        const activeUrl = `${config?.api_endpoint}/services/data/v${parseFloat(config?.api_version).toFixed(1)}/sobjects/Order/${res?.outputValues?.cancelRecordId}`;
                        await axios.patch(activeUrl, { Status: "Activated" }, {
                            headers: {
                            Authorization: `Bearer ${body.accessToken}`,
                            "Content-Type": "application/json",
                            },
                        });
                    }
                })
              } catch (error) {
                console.error(error); //continue with the execution
              }
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