import fs from 'fs'
import TinySegmenter from 'tiny-segmenter'

const main = async () => {
  
  if (!fs.existsSync('./static/db.json')) {
    const db: {
      [key:string]: string[]
    } = {}
    const json = require('./static/yuzuki_roa.json')
    const tinySegmenter = new TinySegmenter();

    // リプライ部分をお前に直してたがお前から始まる割合が多すぎるので一旦除去
    // const tweetData = await json.map((v:{tweet:string}) => {
    //   const text = v.tweet.replace(/@([A-Za-z0-9_]+)\s+/g,'お前、').split("。").join("")
    //   const segments:string[] =  tinySegmenter.segment(text)
      
    //   return segments
    // })

    // リプライとurlが含まれる会話は除去してる
    const tweetData = await json.reduce((acc:string[][], value: { tweet: string }) => {
      const text = value.tweet.replace(/@([A-Za-z0-9_]+)\s+/g,'お前、').split("。").join("")
      if (text.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/)) {
        return acc
      }
      const segments: string[] = tinySegmenter.segment(text)
      acc.push(segments)
      return acc
    },[])

    tweetData.map((tweet:string[]) => {
      ['_BOS_',...tweet,'_EOS_'].sort((a:string, b:string) => {
        db[b] ? db[b] = db[b].concat([a]) : db[b] = [a]
        return 1
      })
    })
    if (!fs.existsSync(`${__dirname}/static`)) {
      fs.mkdirSync(`${__dirname}/static`)
    }
    fs.writeFileSync(`${__dirname}/static/db.json`, JSON.stringify(db))

    return db
  }


}

export default main