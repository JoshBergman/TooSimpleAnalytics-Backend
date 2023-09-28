export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPass = emailRegex.test(email);

  if (!regexPass) {
    return false;
  }

  if (email.length > 100) {
    return false;
  }

  return true;
};
