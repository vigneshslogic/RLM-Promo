import axios from "axios";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  try {
    const instanceURL = `${config?.api_endpoint}/services/data/v${config?.api_version}/sobjects`;
    const payment = body?.payload;
    console.log(body)
    payment.AccountId = body?.accountId;
    console.log("Creating CardPaymentMethod with data:", JSON.stringify(payment, null, 2));
    const response = await axios.post(
      `${instanceURL}/CardPaymentMethod/`,
      payment,
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating CardPaymentMethod:",
      error?.response?.data || error.message
    );
    return { error: error?.response?.data || error.message };
  }
});
