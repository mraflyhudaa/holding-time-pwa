import axios from "axios";
import { loadConfig } from "./loadConfig";

const initializeAxios = async () => {
  const config = await loadConfig();
  const mode = import.meta.env.MODE;

  const instance = axios.create({
    baseURL: config[mode].baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};
export default initializeAxios;
