import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createModel } from "./createModel.js";
import { generateTweet } from "./generateTweet.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export type Options = {
  tweets: number;
  stateSize?: number;
};

export const roakov = async (opotions: Options) => {
  const ASSETS_DIR = path.join(__dirname, "/assets");
  const MODEL_PATH = path.join(ASSETS_DIR, "/model.json");

  try {
    await fs.access(MODEL_PATH);
    if (opotions.stateSize) {
      console.error("modelを破棄し、再生成します");
      await fs.rm(MODEL_PATH);
      await createModel(ASSETS_DIR, opotions.stateSize);
    }
  } catch {
    console.error("modelが存在しません、生成します");
    await createModel(ASSETS_DIR, opotions.stateSize ?? 5);
  }

  const modelData: { [key: string]: string[][] } = JSON.parse(
    await fs.readFile(MODEL_PATH, "utf8")
  );

  const result = await Promise.all(
    [...Array(opotions.tweets)].map(async () => {
      const roa = await generateTweet(modelData);
      return roa;
    })
  );

  return result;
};
