import { JSDOM } from "jsdom";
import wikiToText from "./wikiToText";
import IPage from "../interfaces/IPage";

export default function getPagesFromXml(xml: string): IPage[] {
  const dom = new JSDOM(xml);
  const pages = dom.window.document.querySelectorAll("page");
  const result: IPage[] = [];
  for (const page of pages) {
    if (page.querySelector("redirect")) {
      continue;
    }

    let titleText = "";
    let contentText = "";

    const namespace = page.querySelector("ns");
    if (namespace?.textContent !== "0") {
      continue;
    }
    const title = page.querySelector("title");
    if (title?.textContent) {
      titleText = title.textContent;
    }
    const content = page.querySelector("text");
    if (content?.textContent) {
      let rawContent = wikiToText(content.textContent);

      contentText = rawContent;
    }
    if (titleText && contentText) {
      result.push({ title: titleText, content: contentText });
    }
  }

  return result;
}
