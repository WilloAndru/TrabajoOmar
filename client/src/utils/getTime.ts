export const getTime = (seconds: number) => {
  if (seconds <= 60) return `${Math.round(seconds)} sg`;
  const minutes = seconds / 60;
  if (minutes <= 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  return `${hours.toFixed(1)} h`;
};
