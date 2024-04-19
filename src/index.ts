import fs from "fs";
import argparse from "argparse";
import scrapeFandom from "./functions/scrapeFandom";
import getFandomId from "./functions/getFandomId";
import regexFromString from "./functions/regexFromString";
import IFandomScrapeRequest from "./interfaces/IFandomScrapeRequest";
import { MessageType, printColor } from "./tools/printColor";

async function main() {
  try {
    let input;
    let filter;
    let outputFolder;
    const parser = new argparse.ArgumentParser({
      description: "Scrape data from a Fandom website.",
    });

    parser.add_argument("--input", {
      help: "Fandom website URL",
      required: true,
    });
    parser.add_argument("--filter", {
      help: "Scraping filter.",
      required: false,
    });
    parser.add_argument("--output", {
      help: "Output folder path",
      required: false,
    });

    const args = parser.parse_args();
    input = args.input;
    filter = args.filter;
    outputFolder = args.output || "output";

    if (!fs.existsSync(outputFolder)) {
      printColor(
        `[INFO] ${outputFolder} doesn't exist. Creating now...`,
        MessageType.INFO
      );
      fs.mkdirSync(outputFolder);
      printColor(`[INFO] ${outputFolder} created.`, MessageType.INFO);
    }

    const model: IFandomScrapeRequest = { fandom: input, filter: filter };
    const fandomId = getFandomId(model.fandom);
    filter = regexFromString(model.filter);

    printColor(
      `[INFO] Scraping from https://${fandomId}.fandom.com with filter: ${
        filter ? filter.source : "none"
      }`,
      MessageType.INFO
    );

    const result = await scrapeFandom(fandomId, filter);

    printColor(
      `[SUCC] Successfully scraped ${result.length} pages from https://${fandomId}.fandom.com`,
      MessageType.SUCCESS
    );

    // Write result to JSON file
    const outputFile = `${outputFolder}/${fandomId}.json`;

    // Write result to JSON file
    fs.writeFile(outputFile, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        printColor(
          `[ERROR] Unable to write to file: ${err}`,
          MessageType.ERROR
        );
      } else {
        printColor(`[SUCC] Data saved to ${outputFile}`, MessageType.SUCCESS);
      }
    });
  } catch (error) {
    printColor(
      `[ERR] There was an error while scraping: ${error}`,
      MessageType.ERROR
    );
  }
}

main();
