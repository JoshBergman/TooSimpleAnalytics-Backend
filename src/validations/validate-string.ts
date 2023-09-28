export const validateString = (
  string: string,
  minLength: number,
  maxLength: number
): boolean => {
  if (typeof string !== "string") {
    return false;
  }

  if (string.length < minLength) {
    return false;
  }

  if (string.length > maxLength) {
    return false;
  }

  return true;
};
