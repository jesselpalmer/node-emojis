import { expect } from 'chai'

// Type declaration for the JavaScript module
const getEmojiName = require('../scripts/emoji-name-formatter') as (emojiNameRawStr: string) => string

describe('get-emojis', () => {
  it('should lowercase emoji name', () => {
    const emojiNameRawStr = 'CAT'
    expect(getEmojiName(emojiNameRawStr)).to.equal('cat')
  })

  it('should replace hypen with underscore', () => {
    const emojiNameRawStr = 'smiley-face'
    expect(getEmojiName(emojiNameRawStr)).to.equal('smiley_face')
  })

  it('should replace double hypens with a single underscore', () => {
    const emojiNameRawStr = 'smiley--face'
    expect(getEmojiName(emojiNameRawStr)).to.equal('smiley_face')
  })
})
