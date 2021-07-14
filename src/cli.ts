#!/usr/bin/env node

import meow from "meow";
import { Options, roakov } from "./index.js";

const cli = async () => {
  const cli = meow(
    `
Usage
  $ yarn roakov
Examples
  $ yarn roakov
  roakovで文章を生成
  $ yarn roakov <N>
  N回文章を生成
  $ yarn roakov --create <N>
  現在のモデルを破棄し、<N>階層のモデルを作り直し文章を生成
`,
    {
      importMeta: import.meta,
      flags: {
        create: {
          type: "number",
          alias: "c",
        },
      },
    }
  );

  const { input, flags } = cli;
  if (flags?.v) {
    cli.showVersion();
    return;
  }
  if (flags?.h) {
    cli.showHelp(0);
    return;
  }
  const options: Options = {
    tweets: input[0].match(/^-{0,1}\d+$/) ? +input[0] : 10,
    stateSize: flags.create ?? undefined,
  };

  roakov(options).then((tweets) => {
    tweets.forEach((tweet) => console.log(`「${tweet}」`));
  });
};

cli();
