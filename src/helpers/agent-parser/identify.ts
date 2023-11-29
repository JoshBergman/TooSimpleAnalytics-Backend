export const identifyBrowser = (keywords: string[]) => {
  const sortedKeywords = keywords.slice().sort().join(" ");

  switch (sortedKeywords) {
    case "edg":
    case "chrome edg":
      return "Edge";

    case "chromium":
    case "chrome safari":
    case "chrome chromium":
    case "chromium safari":
      return "Chromium";

    case "seamonkey":
    case "firefox seamonkey":
      return "Seamonkey";

    case "chrome":
      return "Chrome";

    case "firefox":
      return "Firefox";

    case "safari":
      return "Safari";

    case "opr":
    case "opera":
      return "Opera";

    default:
      return "Other";
  }
};
