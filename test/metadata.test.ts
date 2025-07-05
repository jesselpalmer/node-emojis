import { expect } from 'chai'
import emojis from '../lib'

describe('metadata', () => {
  it('should have metadata property', () => {
    expect(emojis).to.have.property('metadata')
    expect(emojis.metadata).to.be.an('object')
  })

  it('should have metadata for all emojis', () => {
    // Get all emoji names
    const emojiNames = Object.keys(emojis).filter(key => {
      // Filter out the special properties
      return !['emojiToName', 'emojis', 'reverseMapping', 'categories', 'metadata', 'searchByKeyword', 'getByCategory', 'getAllNames', 'applySkinTone', 'supportsSkinTone', 'getAllSkinToneVariations', 'removeSkinTone', 'skinTones', 'skinToneModifiers', 'aliases', 'getAliases', 'getPrimaryName', 'isSameEmoji', 'getAllNamesForEmoji', 'default', 'SKIN_TONE_MODIFIERS', 'SKIN_TONES'].includes(key)
    })

    // Check that each emoji has metadata
    emojiNames.forEach(name => {
      expect(emojis.metadata).to.have.property(name)
    })

    // Check metadata count matches emoji count
    expect(Object.keys(emojis.metadata).length).to.equal(emojiNames.length)
  })

  it('should have valid metadata structure', () => {
    const fireMetadata = emojis.metadata.fire

    expect(fireMetadata).to.have.property('emoji').that.equals('🔥')
    expect(fireMetadata).to.have.property('name').that.equals('fire')
    expect(fireMetadata).to.have.property('category').that.equals('nature')
    expect(fireMetadata).to.have.property('keywords').that.is.an('array')
    expect(fireMetadata.keywords).to.include('fire')
    expect(fireMetadata).to.have.property('unicodeVersion').that.is.a('string')
  })

  it('should have correct category assignments', () => {
    expect(emojis.metadata.cat.category).to.equal('animals')
    expect(emojis.metadata.pizza.category).to.equal('food')
    expect(emojis.metadata.fire.category).to.equal('nature')
    expect(emojis.metadata.smile.category).to.equal('people')
    expect(emojis.metadata.mount_fuji.category).to.equal('travel')
  })

  it('should have keywords for searching', () => {
    // Check animal keywords
    const catMetadata = emojis.metadata.cat
    expect(catMetadata.keywords).to.include('cat')
    expect(catMetadata.keywords).to.include('pet')
    expect(catMetadata.keywords).to.include('feline')

    // Check nature keywords
    const fireMetadata = emojis.metadata.fire
    expect(fireMetadata.keywords).to.include('fire')
    expect(fireMetadata.keywords).to.include('hot')
  })

  it('should allow emoji lookup by metadata', () => {
    // Example: Find all animal emojis
    const animalEmojis = Object.entries(emojis.metadata)
      .filter(([_, meta]: [string, any]) => meta.category === 'animals')
      .map(([name, _]) => name)

    expect(animalEmojis).to.include('cat')
    expect(animalEmojis).to.include('dog')
    expect(animalEmojis).to.not.include('pizza')
  })

  it('should allow search by keywords', () => {
    // Example: Find emojis with 'fire' keyword
    const fireEmojis = Object.entries(emojis.metadata)
      .filter(([_, meta]: [string, any]) => meta.keywords.includes('fire'))
      .map(([name, _]) => name)

    expect(fireEmojis).to.include('fire')
    expect(fireEmojis).to.include('flame')
    expect(fireEmojis).to.include('lit')
  })
})
