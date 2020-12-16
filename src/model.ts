import fs from 'fs'
import TinySegmenter from 'tiny-segmenter'

const main = async () => {
  
  if (!fs.existsSync('./static/db.json')) {
    const db: {
      [key:string]: string[]
    } = {}
    const json = require('./static/yuzuki_roa.json')
    const tinySegmenter = new TinySegmenter();
    
    const tweetData = await json.map((v:{tweet:string}) => {
      const text = v.tweet.replace(/@([A-Za-z0-9_]+)\s+/,'お前、')
      const segments:string[] =  tinySegmenter.segment(text.split("。").join(""))
      
      return segments
    })

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