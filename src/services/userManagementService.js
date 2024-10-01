import initializeAxios from "../utils/axios";

export const getUsers = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(`users${search ? `?search=${search}` : ""}`);
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

export const createUser = async (user) => {
  const api = await initializeAxios();
  try {
    const response = await api.post("users", user);
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

export const updateUser = async (id, user) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`users/${id}`, user);
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

export const deleteUser = async (id) => {
  const api = await initializeAxios();
  try {
    const response = await api.delete(`users/${id}`);
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

export const getUserCount = async () => {
  const api = await initializeAxios();
  try {
    const response = await api.get(`users/count`);
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
