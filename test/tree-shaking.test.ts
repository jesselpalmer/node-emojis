import { expect } from 'chai'
import { search } from '../lib/features/search'
import { applySkinTone, supportsSkinTone } from '../lib/features/skin-tones'
import { getAliases, getPrimaryName } from '../lib/features/aliases'
import { filterByCategory, filterByKeyword } from '../lib/features/filters'
import { createReverseMapping } from '../lib/utils/reverse-mapping'
import { isValidEmoji, isValidEmojiName } from '../lib/utils/validators'
import emojis from '../lib/data/emojis.json'
import metadata from '../lib/data/metadata.json'

describe('tree-shakeable imports', () => {
  it('should allow importing search feature separately', () => {
    expect(search).to.be.a('function')

    const results = search('fire')
    expect(results).to.be.an('array')
    expect(results.length).to.be.greaterThan(0)
  })

  it('should allow importing skin-tones feature separately', () => {
    expect(applySkinTone).to.be.a('function')
    expect(supportsSkinTone).to.be.a('function')

    const waveLight = applySkinTone('👋', 'light')
    expect(waveLight).to.equal('👋🏻')
  })

  it('should allow importing aliases feature separately', () => {
    expect(getAliases).to.be.a('function')
    expect(getPrimaryName).to.be.a('function')

    const primaryName = getPrimaryName('flame')
    expect(primaryName).to.equal('fire')
  })

  it('should allow importing filters feature separately', () => {
    expect(filterByCategory).to.be.a('function')
    expect(filterByKeyword).to.be.a('function')

    const animals = filterByCategory('animals')
    expect(animals).to.be.an('array')
    expect(animals.length).to.be.greaterThan(0)
  })

  it('should allow importing utilities separately', () => {
    expect(createReverseMapping).to.be.a('function')
    expect(isValidEmoji).to.be.a('function')
    expect(isValidEmojiName).to.be.a('function')

    expect(isValidEmoji('🔥')).to.be.true
    expect(isValidEmojiName('fire')).to.be.true
  })

  it('should allow importing just the data', () => {
    expect(emojis).to.be.an('object')
    expect(metadata).to.be.an('object')
    expect(emojis.fire).to.equal('🔥')
    expect(metadata.fire).to.have.property('keywords')
  })
})
