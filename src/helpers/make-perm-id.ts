// Based on make-id.ts this is modified to provide users with a non-renewable id.
// although it could be renewed to reset the analytic links

export const generatePermId = () => {
  const generateRandomIdValues = (length: number) => {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let userId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      userId += characters.charAt(randomIndex);
    }

    return userId;
  };

  const generateTimeIdValue = () => {
    const date = new Date();
    const timeValue = date.getTime() + "";
    return timeValue.slice(timeValue.length - 3);
  };

  const id = generateRandomIdValues(10) + generateTimeIdValue();
  return id;
};
