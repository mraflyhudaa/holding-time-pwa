import initializeAxios from "../utils/axios";

export const getProducts = async () => {
  const api = await initializeAxios();
  try {
    const response = await api.get("products");
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
