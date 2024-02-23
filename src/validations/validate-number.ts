export const validateNumber = (
  number: number,
  minSize: number,
  maxSize: number
): boolean => {
  if (typeof number !== "number") {
    return false;
  }

  if (number < minSize) {
    return false;
  }

  if (number > maxSize) {
    return false;
  }

  return true;
};
