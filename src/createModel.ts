import fs from "fs/promises";
import { tokenize } from "kuromojin";
import path from "path";

export type Tweet = {
  id: number;
  conversation_id: string;
  created_at: string;
  date: string;
  time: string;
  timezone: string;
  user_id: number;
  username: string;
  name: string;
  place: string;
  tweet: string;
  language: string;
  mentions: string;
  urls: string[];
  photos: string[];
  replies_count: number;
  retweets_count: number;
  likes_count: number;
  hashtags?: string[];
  cashtags?: string[];
  link: string;
  retweet: boolean;
  quote_url: string;
  video: number;
  thumbnail: string;
  near: string;
  geo: string;
  source: string;
  user_rt_id: string;
  user_rt: string;
  retweet_id: string;
  reply_to: { screen_name: string; name: string; id: string }[];
  retweet_date: string;
  translate: string;
  trans_src: string;
  trans_dest: string;
};

const createTweetModel = (
  tweets: string[][],
  stateSize: number = 2
): { [key: string]: string[][] } => {
  const size = stateSize > 1 && stateSize < 10 ? stateSize : 2;
  const modelData: { [key: string]: string[][] } = {};
  tweets.forEach((tweet) => {
    const tmp = ["_BOS_", ...tweet, "_EOS_"];
    for (let i = 0; i < tweet.length + 1; i++) {
      modelData[tmp[i]]
        ? modelData[tmp[i]].push(tmp.slice(i + 1, i + size))
        : (modelData[tmp[i]] = [tmp.slice(i + 1, i + size)]);
    }
  });

  return modelData;
};

const parseTweetData = async (tweetData: Tweet[]) => {
  const parseTweetData: string[][] = [];
  for await (const tweet of tweetData) {
    // リプライは除去
    if (tweet.reply_to.length || tweet.tweet.match(/@([A-Za-z0-9_]+)\s+/)) {
      continue;
    }
    // RTは除去
    if (tweet.retweet) {
      continue;
    }
    // リンクが入っているツイートは除去
    if (tweet.tweet.match(/https?:\/\//)) {
      continue;
    }
    // 写真付きのツイートは除去
    if (tweet.photos.length) {
      continue;
    }

    const segment = await tokenize(tweet.tweet).then((tokens) =>
      tokens.map((token) => token.surface_form)
    );
    let tmp: string[] = [];
    for await (const token of segment) {
      tmp.push(token);
      if (token === "。") {
        if (tmp.length) parseTweetData.push(tmp);
        tmp = [];
      }
    }
    if (tmp.length) parseTweetData.push(tmp);
  }
  return parseTweetData;
};

export const createModel = async (ASSETS_DIR: string, stateSize?: number) => {
  const TWEET_PATH = path.join(ASSETS_DIR, "/yuzuki_roa.json");
  try {
    await fs.access(TWEET_PATH);
  } catch {
    console.log(`${TWEET_PATH}が存在しません、終了します`);
    throw new Error(`${TWEET_PATH}が存在しません`);
  }
  const tweetData: Tweet[] = JSON.parse(await fs.readFile(TWEET_PATH, "utf8"));
  const shapeTweetData = await parseTweetData(tweetData);

  const modelData = createTweetModel(shapeTweetData, stateSize);

  await fs.writeFile(path.join(ASSETS_DIR, "/model.json"), JSON.stringify(modelData, null, 2));
  return;
};
