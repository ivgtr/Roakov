import fs from 'fs'
import path, { resolve } from 'path'
import json from './static/roa_slim.json'
const TinySegmenter = require('tiny-segmenter')

const main = async (w = 'こんにちは') => {
  const tinySegmenter = new TinySegmenter();
  

  const index = {}
  
  const tweetData = await json.map((v) => {
    const text = v.tweet.replace(/@([A-Za-z0-9_]+)\s+/,'お前、')
    const segments:string[] =  tinySegmenter.segment(text.split("。").join(""))
    
    return segments
  })

  tweetData.map((tweet) => {
    ['_BOS_',...tweet,'_EOS_'].sort((a:string, b:string) => {
      // if (index[b].) {
      //   index[b] = 
      // }
      return 1
    })
  })  
}

(() => {
  main()
})()