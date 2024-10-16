import initializeAxios from "../utils/axios";

export const getProducts = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `products${search ? `?search=${search}` : ""}`
    );
    // // console.log(response.data);
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

export const updateProduct = async (id, updateData) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`products/${id}`, updateData);
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
