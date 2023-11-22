// creates random 6 - digit code that is to be emailed to the user's email to confirm ownership / authenticity of the email

export const generateEmailVerificationCode = () => {
  const generateRandomIdValues = (length: number) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let userId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      userId += characters.charAt(randomIndex);
    }

    return userId;
  };

  const id = generateRandomIdValues(6);
  return id;
};
