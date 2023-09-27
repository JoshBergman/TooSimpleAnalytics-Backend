// My attempt at making a unique ID for each user, based off of
// uuidV1, and uuidV4

//effectively returns 16 digits (8 random, 8 time based)

export const generateId = () => {
const generateRandomIdValues = (length: number) => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let userId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      userId += characters.charAt(randomIndex);
    }
  
    return userId;
  }

const generateTimeIdValue = () => {
    const date = new Date();
    const timeValue = date.getTime() + "";
    return timeValue.slice(timeValue.length - 8);
}

const id = generateRandomIdValues(8) + generateTimeIdValue();
return id;
}