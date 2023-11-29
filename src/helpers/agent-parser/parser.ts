// DATA LOCATIONS:
// All KEYWORDS are stored in gatherKeywords.ts, hardcoded into the switch case.
// Keyword combinations to BROWSER IDENTIFICATIONS is in identify.ts

// Intended plan:
// 1. get an array of keywords relevant to identifying the browser
// 3. check for the "Mobi" string -> device type
// 2. compare keywords to most likely browser -> browser

import { gatherKeywords } from "./gatherKeywords.js";
import { identifyBrowser } from "./identify.js";

export const parse_user_agent = (
  user_agent_string: string
): [browser: string, isMobile: boolean] => {
  const keywords = gatherKeywords(user_agent_string);

  let isMobile = false;
  if (keywords.includes("mobi")) {
    keywords.splice(keywords.indexOf("mobi"), 1);
    isMobile = true;
  }

  const browser = identifyBrowser(keywords);
  return [browser, isMobile];
};
