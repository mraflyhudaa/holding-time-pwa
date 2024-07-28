import { convertToMilliseconds } from "./convertToMilliseconds";

export const sortItemsByLifeTime = (items) => {
  return items.sort((a, b) => a.remainingTimeMs - b.remainingTimeMs);
};
