import { useState, useEffect, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import { loadConfig } from "./loadConfig";

const useAlertStream = () => {
  const [config, setConfig] = useState(null);
  const mode = import.meta.env.MODE;
  const eventSourceRef = useRef(null);

  useEffect(() => {
    loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  useEffect(() => {
    if (!config) return;

    let retryTimeout;

    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    };

    const connectToSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      eventSourceRef.current = new EventSource(
        `${config[mode].baseURL}/alerts`
      );

      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          data.forEach((alert) => {
            if (alert.type === "low_quantity") {
              toast.warn(alert.message, toastOptions);
            } else {
              toast.error(alert.message, toastOptions);
            }
          });
        }
      };

      eventSourceRef.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        toast.error("Connection to alert stream failed. Retrying...", {
          ...toastOptions,
          autoClose: 3000,
        });
        eventSourceRef.current.close();
        retryTimeout = setTimeout(connectToSSE, 5000);
      };
    };

    connectToSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [config, mode]);
};

export default useAlertStream;
