const getEmojiName = function (emojiNameRawStr) {
  return emojiNameRawStr.replace(/\W/g, ' ')
    .replace(/ {2}/g, ' ')
    .replace(/ /g, '_')
    .replace(/__/g, '_')
    .toLowerCase()
}

module.exports = getEmojiName