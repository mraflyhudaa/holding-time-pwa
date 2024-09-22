import initializeAxios from "../utils/axios";

export const getHoldingTime = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `holding-time${search ? `?search=${search}` : ""}`
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

export const createItemHoldingTime = async (item) => {
  const api = await initializeAxios();
  try {
    const response = await api.post("holding-time", {
      noitem: item.noitem,
      name: item.name,
      qty_portion: item.qty_portion,
      uom: item.uom,
      lifeTime: item.lifeTime || "00:00:00",
      display_id: item.display_id,
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

export const updateStatusHoldingTime = async (item) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`holding-time/expire/${item.id}`);
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

export const deleteItemHoldingTime = async (id) => {
  const api = await initializeAxios();
  try {
    const response = await api.delete(`holding-time/${id}`);
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

export const sumQtyItemHoldingTime = async () => {
  const api = await initializeAxios();
  try {
    const response = await api.get(`holding-time/sum-qty`);
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
