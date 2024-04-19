Standalone version of [SillyTavern's Fandom Scraper](https://github.com/Cohee1207/SillyTavern-Fandom-Scraper) used for scraping Fandom sites for lore for text generation algorithm training. All that was changed from SillyTavern's version is that the functions have been abstracted, and a standalone script was made to be run.

Fandom scraping can be accomplished by using the export page in the wikis, however this is rarely updated, and an admin has to approve a wikidump; This utilizes the Special:AllPages instead, so that the most up-to-date lore and information can be scraped.

PLEASE NOTE: This code is in no means efficient. It is a shitty script implementation of the SillyTavern scraper, and has many inefficient functions. Feel free to PR fixes, however the script is still quite fast as is, so I've just left it.

## Features

- Takes a fandom's wiki URL and utilizes the built-in Special:AllPages functionality to export all of the wiki pages from the site. This allows for a non-invasive and harmless way of collecting lore and information.
- Extremely quick. Scraped 44,101 pages (176,000 lines) of Fallout wiki in ~4mins.

## Important (Please Read)

If you are scraping a large wiki (20,000+ pages), you **will** get a memory heap error. To avoid this, you can use a band-aid fix as follows:

```shell
node --max-old-space-size=10000 out/index.js --input [INPUT]
```

Where `--max-old-space-size=10000` is the amount of space in megabytes you want to reserve to the Node.js environment. Recommended value: 6000 - The memory will still be released per usual when the script is finished.

## Setup

I will not be providing executables for these files, as it is as simple as downloading node and running two commands.

```shell
npm install

npm run build

node out/index.js --input WIKIURL [--filter FILTER] [--output OUTPUT_FOLDER]
```

This will, as stated above, scrape all available Wiki pages for the URL of your choosing and convert them into JSON.

There are scripts in the package.json file, however it is not recommended to run those. The library used to convert wiki text to plain text is deprecated and will spit TypeErrors all day long.

## Requirements

- Operating System: Any (Tested on Windows 10 and MacOS)
- Node.js

## Usage

For ease of use, commandline flags are provided so you can scrape without having do change any code.

- `--input` Required: The FULL URL to the fandom page. (i.e. https://fallout.fandom.com). Providing only the name or forgetting the https:// will result in an error.
- `--filter` Optional: The filter(s) you want to use when scraping. No default.
- `--output` Optional: The FULL PATH to the folder where you want the .json file to be written to. By default, an output folder is created in the root directory.

## Contributing

Anyone is welcome to contribute to this as long as it provides something meaningful. Do not PR with syntax fixes or comment grammar fixes unless they are breaking.
