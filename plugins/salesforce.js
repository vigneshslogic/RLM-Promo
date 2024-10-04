import axios from "axios";

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

  const getProducts = async () => {
    const accessToken = await axios.post("/api/getAccessToken");
    const products = await axios.post("/api/getProducts", {
      accessToken: accessToken?.data?.access_token,
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

  return {
    provide: {
      getProducts,
      getProductDetails,
      registerUser,
      loginUser,
    },
  };
});
