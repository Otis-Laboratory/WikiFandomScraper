import { MessageType, printColor } from "../tools/printColor";

export default function getFandomId(fandom: string) {
  try {
    fandom = fandom.trim();
    const url = new URL(fandom);
    const hostname = url.hostname;
    const parts = hostname.split(".");
    const fandomId = parts[0];

    if (!fandomId) return fandom;

    printColor(`[INFO] Fandom ID: ${fandomId}`, MessageType.INFO);
    return fandomId;
  } catch (error) {
    console.log(
      `[ERR] There was an error while getting the Fandom ID: ${error}`
    );
    return fandom;
  }
}
