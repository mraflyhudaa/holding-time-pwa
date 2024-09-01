import initializeAxios from "../utils/axios";

export const getProductThresholds = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `product-thresholds${search ? `?search=${search}` : ""}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const getSpecialProductThresholds = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `product-thresholds/special${search ? `?search=${search}` : ""}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const updateProductThresholds = async (id, updateData) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`product-thresholds/${id}`, updateData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};
