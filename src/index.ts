import readline from "readline-sync"


const main = async (w = 'こんにちは') => {

  const v = readline.question(`${w}`)

  return main(v)
}

(() => {
  main()
})()