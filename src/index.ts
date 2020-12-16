import fs from 'fs'
import model from './model'

const makeSentence = (morpheme: {
    [key:string]: string[]
  }) => {
    var now_word = ""
    var morphemes = ""
    now_word = morpheme["_BOS_"][Math.floor( Math.random() * morpheme["_BOS_"].length )];
    morphemes += now_word;
    while(now_word != "_EOS_"){
        now_word = morpheme[now_word][Math.floor( Math.random() * morpheme[now_word].length )];
        morphemes += now_word;
    }
    morphemes = morphemes.replace(/_EOS_$/,"。")
    return morphemes;
}

const main = async () => {
  if (fs.existsSync(`${__dirname}/static/db.json`)) {
    const db:{[key:string]: string[]} = JSON.parse(fs.readFileSync(`${__dirname}/static/db.json`, 'utf8'))
    console.log(makeSentence(db))
    return
  }
  const _db = await model()
  console.log(makeSentence(_db as {[key:string]: string[]}))
  return
}

(() => {
  main()
})()