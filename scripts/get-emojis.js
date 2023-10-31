const puppeteer = require('puppeteer')

const getEmojiName = emojiNameRawStr => {
  return emojiNameRawStr.replace(/\W/g, ' ')
    .replace(/ {2}/g, ' ')
    .replace(/ /g, '_')
    .replace(/__/g, '_')
    .toLowerCase()
}

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://emojipedia.org/emoji-1.0/')
  const emojisObject = {}

  const emojis = await page.$$eval('li', emojis => emojis.map(emojiElement => {
    const emojiStr = emojiElement.textContent
    const emoji = emojiStr.split(' ')[0].trim()
    const emojiNameRawStr = emojiStr.split(' ')
      .splice(1)
      .join(' ')
    const emojiName = getEmojiName(emojiNameRawStr)

    return [emoji, emojiName]
  }))

  for (const index in emojis) {
    const currentEmojiArray = emojis[index]

    if (currentEmojiArray[0] !== '' || currentEmojiArray[0] !== ' ' || currentEmojiArray[0] !== 'Emoji') {
      emojisObject[currentEmojiArray[1]] = currentEmojiArray[0]
    }
  }

  console.log(JSON.stringify(emojisObject))
  await browser.close()
})()

module.exports = getEmojiName
