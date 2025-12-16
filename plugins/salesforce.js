import axios from "axios";
import pkg from 'lodash';

const { map } = pkg;

export default defineNuxtPlugin(() => {
  const getUserDetails = async (user, accessToken) => {
    const getUser = await axios.post("/api/checkUserExists", {
      accessToken: accessToken,
      user,
    });

    if (getUser.status !== 200) {
      return false;
    }
    return getUser;
  };

  const registerUser = async (user) => {
    const accessToken = await axios.post("/api/getAccessToken");

    const newUser = await axios.post("/api/createUser", {
      accessToken: accessToken?.data?.access_token,
      user,
    });

    if (newUser.status !== 200) {
      return false;
    }

    if (newUser.status === 200) {
      return getUserDetails(
        { ...user, email: user.Email },
        accessToken?.data?.access_token
      );
    }

    return false;
  };

  const loginUser = async (user) => {
    const accessToken = await axios.post("/api/getAccessToken");
    return getUserDetails(user, accessToken?.data?.access_token);
  };

  const getProducts = async (catalogId = null, isCategory = false) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const products = await axios.post("/api/getProducts", {
      accessToken: accessToken?.data?.access_token,
      catalogId: catalogId,
      isCategory: isCategory,
    });

    if (products.status === 200) {
      return products.data;
    }

    return false;
  };

  const getProductDetails = async (projectId) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const categories = await axios.post("/api/getProductDetails", {
      accessToken: accessToken?.data?.access_token,
      product: projectId,
    });

    if (categories.status === 200) {
      return categories.data;
    }

    return false;
  };

  const generateQuote = async (products, description) => {
    try {
      const accessToken = await axios.post("/api/getAccessToken");
      const quote = await axios.post("/api/getQuote", {
        accessToken: accessToken?.data?.access_token,
        products,
        description,
        contactId: useCookie('userInfo')?.value?.Id,
        accountId: useCookie('userInfo')?.value?.Account?.Id,
        userName: `${useCookie('userInfo')?.value?.FirstName} ${useCookie('userInfo')?.value?.LastName}`
      });
  
      if (quote.status === 200) {
        return quote.data;
      }
      return false;
    } catch (error) {
      throw createError({
        statusCode: error.response ? error.response.status : 500,
        message: error.response ? error.response?.data?.message : error.message,
      });
    }
  };

  const placeOrder = async (products, user) => {
    try {
      const accessToken = await axios.post("/api/getAccessToken");
      const order = await axios.post("/api/placeOrder", {
        accessToken: accessToken?.data?.access_token,
        products,
        user,
        contactId: useCookie('userInfo')?.value?.Id,
        accountId: useCookie('userInfo')?.value?.Account?.Id,
        userName: `${useCookie('userInfo')?.value?.FirstName} ${useCookie('userInfo')?.value?.LastName}`,
      });
  
      if (order.status === 200) {
        const userInfo = useCookie('userInfo').value;
        userInfo.Account.BillingCity = user?.city?.value;
        userInfo.Account.BillingCountry = user?.state?.value;
        userInfo.Account.BillingState = user?.state?.value;
        userInfo.Account.BillingStreet = user?.address?.value;
        userInfo.Account.BillingPostalCode = user?.pincode?.value;
        userInfo.Account.ShippingCity = user?.city?.value;
        userInfo.Account.ShippingCountry = user?.state?.value;
        userInfo.Account.ShippingState = user?.state?.value;
        userInfo.Account.ShippingStreet = user?.address?.value;
        userInfo.Account.ShippingPostalCode = user?.pincode?.value;
      
        useCookie('userInfo').value = userInfo;
        return order.data;
      }
  
      return false;
    } catch (error) {
      throw createError({
        statusCode: error.response ? error.response.status : 500,
        message: error.response ? error.response?.data?.message : error.message,
      });
    }
  };

  const getOrders = async () => {
    const accessToken = await axios.post("/api/getAccessToken");
    const orders = await axios.post("/api/getOrders", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
    });

    if (orders.status === 200) {
      return orders.data;
    }

    return false;
  }

  const getInvoices = async () => {
    const accessToken = await axios.post("/api/getAccessToken");
    const invoices = await axios.post("/api/getInvoices", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
    });

    if (invoices.status === 200) {
      return invoices.data;
    }

    return false;
  }

  const downloadInvoice = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const invoice = await axios.post("/api/downloadInvoice", {
      accessToken: accessToken?.data?.access_token,
      invoiceId: payload,
    }, { responseType: 'blob' });
    return invoice;
  }

  const getAssets = async () => {
    const accessToken = await axios.post("/api/getAccessToken");
    const invoices = await axios.post("/api/getAssets", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
    });

    if (invoices.status === 200) {
      return invoices.data;
    }

    return false;
  }

  const getPayments = async () => {
    const accessToken = await axios.post("/api/getAccessToken");
    const payments = await axios.post("/api/getPayments", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
    });
    if (payments.status === 200) {
      return payments.data;
    }
    return false;
  }

  const createPayment = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const payments = await axios.post("/api/createPayment", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
      payload,
    });
    if (payments.status === 200) {
      return payments.data;
    }
    return false;
  }

  const getCategories = async () => {

    const accessToken = await axios.post("/api/getAccessToken");
    const catalogs = await axios.post("/api/getCatalogs", {
      accessToken: accessToken?.data?.access_token,
    });
    if (catalogs?.data?.done === true) {
      if (catalogs?.data?.records) {
        const allCatalogs = map(catalogs?.data?.records, 'Name');
          const categories = await axios.post("/api/getCategories", {
            accessToken: accessToken?.data?.access_token,
            catalog: `(${allCatalogs.map(name => `'${name}'`).join(', ')})`
          });
          if (categories?.data?.records || categories?.status === 200) {
            return {
              catalog: catalogs?.data?.records,
              categories: categories?.data?.records,
            }
          }
      }
      return [];
    }
    return ;
  }

  const changeQuantity = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const invoices = await axios.post("/api/changeQuantity", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
      payload,
    });

    if (invoices.status === 200) {
      return invoices.data;
    }

    return false;
  }

  const cancelSubscription = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const subscription = await axios.post("/api/cancelSubscription", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
      payload
    });

    if (subscription.status === 200) {
      return subscription.data;
    }

    return false;
  }

  const renewSubscription = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const subscription = await axios.post("/api/renewSubscription", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
      payload
    });

    if (subscription.status === 200) {
      return subscription.data;
    }

    return false;
  }

  const upgradeSubscription = async (payload,other) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const upgrade = await axios.post("/api/upgradeSubscription", {
      accessToken: accessToken?.data?.access_token,
      accountId: useCookie('userInfo')?.value?.Account?.Id,
      payload,
      other
    });
  }

  const attributePricing = async (payload) => {
    const accessToken = await axios.post("/api/getAccessToken");
    const pricing = await axios.post("/api/attributePricing", {
      accessToken: accessToken?.data?.access_token,
      payload
    });
    if (pricing.status === 200){
      return pricing.data;
    }
    return pricing.data;
  }

  return {
    provide: {
      getProducts,
      getProductDetails,
      registerUser,
      loginUser,
      generateQuote,
      placeOrder,
      getOrders,
      getInvoices,
      getPayments,
      createPayment,
      downloadInvoice,
      getAssets,
      getCategories,
      changeQuantity,
      cancelSubscription,
      renewSubscription,
      upgradeSubscription,
      attributePricing,
    },
  };
});
