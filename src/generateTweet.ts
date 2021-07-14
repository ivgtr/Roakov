const makeSentence = (morpheme: { [key: string]: string[][] }) => {
  let last_word = "";
  let now_words: string[] = [];
  let morphemes = "";
  now_words = morpheme["_BOS_"][Math.floor(Math.random() * morpheme["_BOS_"].length)];
  last_word = now_words[now_words.length - 1];
  morphemes += now_words.join("");
  while (last_word !== "_EOS_") {
    now_words = morpheme[last_word][Math.floor(Math.random() * morpheme[last_word].length)];
    last_word = now_words[now_words.length - 1];
    morphemes += now_words.join("");
  }
  morphemes = morphemes.replace(/_EOS_$/, "");
  return morphemes;
};

export const generateTweet = (model: { [key: string]: string[][] }) => makeSentence(model);
