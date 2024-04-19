import * as he from "he";
import * as wt2pt from "wikitext2plaintext";

export default function wikiToText(wiki: string): string {
  // Parse wiki text to plain text
  const parser = new wt2pt.default();
  let rawContent = parser.parse(wiki);

  // Remove extra spaces between brackets
  rawContent = rawContent.replace(/\(\s+/g, "(");
  // Remove empty brackets, non-breaking spaces and spaces before commas
  rawContent = rawContent
    .replace("()", "")
    .replace("\u00a0", " ")
    .replace(" , ", ", ");
  // Decode HTML entities
  rawContent = he.decode(rawContent);

  // Remove lines starting with 'Category:'
  rawContent = rawContent
    .split("\n")
    .filter((line) => !line.startsWith("Category:"))
    .join("\n");
  // Remove HTML tags (leave only text)
  rawContent = rawContent.replace(/<[^>]*>/g, "");

  return rawContent;
}
