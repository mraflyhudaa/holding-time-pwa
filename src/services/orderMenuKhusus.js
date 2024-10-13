import initializeAxios from "../utils/axios";

export const getOrderSpecialItems = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `special-items${search ? `?search=${search}` : ""}`
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

export const createOrderSpecialItem = async (item) => {
  const api = await initializeAxios();
  try {
    const response = await api.post("special-items", {
      noitem: item.noitem,
      name: item.name,
      plu: item.plu,
      qty: item.qty,
      uom: item.uom,
      status: item.status || "pending",
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

export const updateOrderSpecialItem = async (id, item) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`special-items/${id}`, {
      noitem: item.noitem,
      name: item.name,
      plu: item.plu,
      qty: item.qty,
      uom: item.uom,
      status: item.status || "completed",
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

export const deleteOrderSpecialItem = async (id) => {
  const api = await initializeAxios();
  try {
    const response = await api.delete(`special-items/${id}`);
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

export const updateOrderSpecialItemStatus = async (id) => {
  const api = await initializeAxios();
  try {
    const response = await api.put(`special-items/${id}`, {
      status: "finished",
      cooking_start_time: 0,
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
