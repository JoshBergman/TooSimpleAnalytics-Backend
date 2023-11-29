const is_relevant_keyword = (keyword: string): boolean => {
  const word = keyword.toLowerCase();

  switch (word) {
    case "mobi":
    case "firefox":
    case "seamonkey":
    case "chrome":
    case "chromium":
    case "safari":
    case "opr":
    case "opera":
    case "edg":
      return true;
    default:
      return false;
  }
};

const isLetter = (str: string) => {
  return str.length === 1 && /[a-z]/i.test(str);
};

export const gatherKeywords = (user_agent_string: string) => {
  let currentWord = "";
  const keywords: string[] = [];

  for (let i = 0; i < user_agent_string.length; i++) {
    const currentLetter = user_agent_string[i];
    if (isLetter(currentLetter)) {
      currentWord += user_agent_string[i];
      if (is_relevant_keyword(currentWord)) {
        keywords.push(currentWord.toLowerCase());
        currentWord = "";
      }
    } else {
      currentWord = "";
    }
  }
  return keywords;
};
