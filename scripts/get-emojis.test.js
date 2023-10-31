/* eslint-env mocha */

const expect = require('chai').expect
const getEmojiName = require('./get-emojis')

describe('emojis', () => {
  test('should lowercase emoji name', () => {
    const emojiNameRawStr = 'CAT'
    expect(getEmojiName(emojiNameRawStr)).toMatch('cat')
  })

  test('should replace hypen with underscore', () => {
    const emojiNameRawStr = 'smiley-face'
    expect(getEmojiName(emojiNameRawStr)).toMatch('smiley_face')
  })

  test('should replace double hypens with a single underscore', () => {
    const emojiNameRawStr = 'smiley--face'
    expect(getEmojiName(emojiNameRawStr)).toMatch('smiley_face')
  })
})
