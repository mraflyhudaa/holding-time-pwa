import initializeAxios from "../utils/axios";

const authService = {
  login: async (username, password) => {
    const api = await initializeAxios();

    try {
      const response = await api.post("auth/login", {
        username,
        password,
      });
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
  },
};

export default authService;
