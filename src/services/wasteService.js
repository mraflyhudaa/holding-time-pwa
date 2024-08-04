import initializeAxios from "../utils/axios";

export const createWasteItem = async (item) => {
  const api = await initializeAxios();
  try {
    const response = await api.post("waste-items", {
      noitem: item.noitem,
      name: item.name,
      qty: item.qty,
      uom: item.uom,
      start_time: item.startTime,
      end_time: new Date().getTime(),
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
};

export const getWasteItem = async (item) => {
  const api = await initializeAxios();
  try {
    const response = await api.get("waste-items");
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
