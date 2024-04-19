/**
 * Instantiates a regular expression from a string.
 * @param {string} input The input string.
 * @returns {RegExp} The regular expression instance.
 * @copyright Originally from: https://github.com/IonicaBizau/regex-parser.js/blob/master/lib/index.js
 */
export default function regexFromString(input: string): RegExp | undefined {
  try {
    // Parse input
    const match = input?.match(/(\/?)(.+)\1([a-z]*)/i);

    if (!match) {
      return;
    }

    // Invalid flags
    if (match[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(match[3])) {
      const defaultFlags = "i";
      return RegExp(input, defaultFlags);
    }

    // Create the regular expression
    return new RegExp(match[2], match[3]);
  } catch {
    return;
  }
}
