export const getViewDate = (): [year: number, month: number, day: number] => {
  const currentDate = new Date();

  if (isNaN(currentDate.getTime())) {
    return [0, 0, 0];
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  return [year, month, day];
};
