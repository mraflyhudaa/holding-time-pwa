const version = import.meta.env.VITE_APP_VERSION;

export const loadConfig = async () => {
  const response = await fetch(`/config.json?v=${version}`);
  const config = await response.json();
  return config;
};
