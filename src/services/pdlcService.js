import initializeAxios from "../utils/axios";

export const calculatePDLC = async (shhb, dateFrom, dateTo, setProgress) => {
  const api = await initializeAxios();
  try {
    const params = new URLSearchParams();
    params.append("itemp", "1");
    params.append("shhb", shhb);
    params.append("dtg1", dateFrom);
    params.append("dtg2", dateTo);
    const response = await api.post("calculate-sales", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
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

export const getPDLCCalc = async (search) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      `pdlc-calc${search ? `?search=${search}` : ""}`
    );
    return response.data;
  } catch (error) {
    // console.log(error);
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
