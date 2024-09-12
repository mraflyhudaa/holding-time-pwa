import initializeAxios from "../utils/axios";

export const calculatePDLC = async (dateFrom, dateTo, setProgress) => {
  const api = await initializeAxios();
  try {
    const response = await api.get(
      "master-plud",
      //   {
      //     dateFrom,
      //     dateTo,
      //   },
      {
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      }
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
