import initializeAxios from "../utils/axios";

export const getMasterDisplay = async () => {
  const api = await initializeAxios();
  try {
    const response = await api.get("master-display");
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

export const createMasterDisplay = async (data) => {
  const api = await initializeAxios();
  try {
    const response = await api.post("master-display", data);
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

export const updateMasterDisplay = async (id, data) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`master-display/${id}`, data);
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

export const deleteMasterDisplay = async (id) => {
  const api = await initializeAxios();
  try {
    const response = await api.delete(`master-display/${id}`);
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
