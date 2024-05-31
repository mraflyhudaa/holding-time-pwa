type CalcDate = {
  expiryDate: Date;
};

export const calculateRemainingTime = ({ expiryDate }: CalcDate) => {
  const now: Date = new Date();
  const difference = expiryDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { minutes: 0, seconds: 0 };
  }

  const minutes = Math.floor(difference / 1000 / 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { minutes, seconds };
};
