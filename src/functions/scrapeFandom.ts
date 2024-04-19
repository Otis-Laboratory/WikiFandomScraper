import { JSDOM } from "jsdom";
import { MessageType, printColor } from "../tools/printColor";
import getPagesFromXml from "./getPagesFromXml";
import IPage from "../interfaces/IPage";

const USER_AGENT: string =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export default async function scrapeFandom(
  fandomId: string,
  filter?: RegExp
): Promise<IPage[]> {
  const baseUrl = `https://${fandomId}.fandom.com/`;
  let nextPageUrl = "/wiki/Special:AllPages";
  let counter = 0;
  const rawXml: any[] = [];

  while (nextPageUrl !== "") {
    const currentUrl = new URL(nextPageUrl, baseUrl);
    const fetchResponse = await fetch(currentUrl, {
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT },
    });
    const fetchContent = await fetchResponse.text();
    const dom = new JSDOM(fetchContent);
    const content = dom.window.document.querySelector(".mw-allpages-body");
    const nextPage = dom.window.document.querySelector(".mw-allpages-nav");
    const listOfPages: string[] = [];

    dom.window.close(); // try to avoid memleaks so we close

    if (content) {
      const listOfEntries = content.querySelectorAll("li");
      for (const entry of listOfEntries) {
        if (entry?.textContent) {
          const pageLink = entry.textContent.replace("(redirect", "") + "\n";
          if (filter && !new RegExp(filter).test(pageLink)) {
            continue;
          }
          listOfPages.push(pageLink);
        }
      }
    }

    const payload = new URLSearchParams();
    payload.append("catname", "");
    payload.append("pages", listOfPages.join("\n"));
    payload.append("curonly", "1");
    payload.append("wpDownload", "1");
    payload.append("wpEditToken", "+\\");
    payload.append("title", "Special:Export");

    printColor(
      `[INFO] Currently exporting from ${currentUrl}`,
      MessageType.INFO
    );

    const response = await fetch(
      `https://${fandomId}.fandom.com/wiki/Special:Export`,
      {
        method: "POST",
        body: payload,
        headers: { "User-Agent": USER_AGENT },
      }
    );

    const data = await response.text();
    rawXml.push(data);
    counter += 1;

    if (nextPage) {
      const nav = nextPage.querySelectorAll("a");
      if (nav.length > 0) {
        if (nav[nav.length - 1]?.textContent?.includes("Next page")) {
          nextPageUrl = nav[nav.length - 1].href;
        } else {
          nextPageUrl = "";
          break;
        }
      } else {
        nextPageUrl = "";
        break;
      }
    } else {
      nextPageUrl = "";
      break;
    }
  }

  printColor(`[INFO] Finished scraping, mapping XML...`, MessageType.INFO);

  return rawXml.flatMap((xml) => getPagesFromXml(xml));
}
