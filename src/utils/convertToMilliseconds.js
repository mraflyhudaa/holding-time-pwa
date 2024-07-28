export const convertToMilliseconds = (time) => {
  if (!time || typeof time !== "string") {
    console.warn(`Invalid time format: ${time}`);
    return 0;
  }
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
};
