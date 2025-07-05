import { expect } from 'chai'
import emojis from '../lib'

describe('reverse mapping', () => {
  it('should have emojiToName property', () => {
    expect(emojis).to.have.property('emojiToName')
    expect(emojis.emojiToName).to.be.an('object')
  })

  it('should have reverseMapping property (alias)', () => {
    expect(emojis).to.have.property('reverseMapping')
    expect(emojis.reverseMapping).to.equal(emojis.emojiToName)
  })

  it('should map emoji to name correctly', () => {
    // Test various emojis
    expect(emojis.emojiToName['🔥']).to.be.oneOf(['fire', 'flame', 'hot', 'lit', 'snapstreak'])
    expect(emojis.emojiToName['🐈']).to.be.oneOf(['cat', 'domestic_cat', 'domesticcat', 'feline', 'housecat'])
    expect(typeof emojis.emojiToName['😄']).to.equal('string')
    expect(emojis.emojiToName['🍕']).to.equal('pizza')
  })

  it('should handle emoji lookup that exists', () => {
    const emoji = '🔥'
    const name = emojis.emojiToName[emoji]
    expect(typeof name).to.equal('string')
    expect(emojis[name]).to.equal(emoji)
  })

  it('should return undefined for non-existent emoji', () => {
    expect(emojis.emojiToName['💩💩💩']).to.equal(undefined)
    expect(emojis.emojiToName['not-an-emoji']).to.equal(undefined)
  })

  it('should maintain backward compatibility', () => {
    // Original API should still work
    expect(emojis.fire).to.equal('🔥')
    expect(emojis.cat).to.equal('🐈')
    expect(emojis.pizza).to.equal('🍕')
  })
})
