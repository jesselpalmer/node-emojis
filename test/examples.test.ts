import { expect } from 'chai'
import emojis from '../lib'
import { search } from '../lib/features/search'
import { applySkinTone } from '../lib/features/skin-tones'
import { filterByCategory } from '../lib/features/filters'

describe('README examples', () => {
  describe('Quick Start examples', () => {
    it('should work with backward compatible import', () => {
      expect(emojis.fire).to.equal('🔥')
    })

    it('should work with tree-shakeable imports', () => {
      expect(search).to.be.a('function')
      expect(applySkinTone).to.be.a('function')
    })
  })

  describe('Basic usage examples', () => {
    it('should access emojis directly', () => {
      expect(emojis.fire).to.equal('🔥')
      expect(emojis.heart).to.equal('❤️')
      expect(emojis.smile).to.equal('😄')
      expect(emojis.thumbs_up).to.equal('👍')
    })

    it('should work with aliases', () => {
      expect(emojis.thumbsup).to.equal('👍')
      expect(emojis['+1']).to.equal('👍')
      expect(emojis.flame).to.equal('🔥')
      expect(emojis.hot).to.equal('🔥')
    })
  })

  describe('Search functionality examples', () => {
    it('should search by keyword', () => {
      const results = emojis.searchByKeyword('happy')

      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)
      expect(results[0]).to.have.property('name')
      expect(results[0]).to.have.property('emoji')
      expect(results[0]).to.have.property('metadata')
    })

    it('should work with tree-shakeable search', () => {
      const results = search('fire')

      expect(results).to.be.an('array')
      expect(results.find(r => r.name === 'fire')).to.exist
    })
  })

  describe('Skin tone examples', () => {
    it('should apply skin tones', () => {
      const waveLight = emojis.applySkinTone('👋', 'light')
      expect(waveLight).to.equal('👋🏻')

      const waveDark = emojis.applySkinTone('👋', 'dark')
      expect(waveDark).to.equal('👋🏿')

      const waveNumeric = emojis.applySkinTone('👋', '3')
      expect(waveNumeric).to.equal('👋🏽')
    })

    it('should get all skin tone variations', () => {
      const variations = emojis.getAllSkinToneVariations('👋')

      expect(variations).to.have.property('default', '👋')
      expect(variations).to.have.property('light', '👋🏻')
      expect(variations).to.have.property('dark', '👋🏿')
    })

    it('should check skin tone support', () => {
      expect(emojis.supportsSkinTone('wave')).to.be.true
      expect(emojis.supportsSkinTone('fire')).to.be.false
    })
  })

  describe('Categories examples', () => {
    it('should access categories', () => {
      expect(emojis.categories).to.be.an('object')
      expect(emojis.categories.animals).to.be.an('object')
      expect(emojis.categories.animals.cat).to.equal('🐈')
      expect(emojis.categories.food.pizza).to.equal('🍕')
    })

    it('should get emojis by category', () => {
      const animals = emojis.getByCategory('animals')

      expect(animals).to.be.an('array')
      expect(animals.length).to.be.greaterThan(0)
      expect(animals[0]).to.have.property('metadata')
    })

    it('should use tree-shakeable filters', () => {
      const animals = filterByCategory('animals')

      expect(animals).to.be.an('array')
      expect(animals.find(e => e.name === 'cat')).to.exist
    })
  })

  describe('Metadata examples', () => {
    it('should access metadata', () => {
      expect(emojis.metadata.fire).to.be.an('object')
      expect(emojis.metadata.fire.keywords).to.include('fire')
      expect(emojis.metadata.fire.category).to.equal('nature')
      expect(emojis.metadata.fire.unicodeVersion).to.exist
    })
  })

  describe('Reverse mapping examples', () => {
    it('should map emoji to name', () => {
      // Fire emoji has multiple aliases, so it could be any of them
      expect(emojis.emojiToName['🔥']).to.be.oneOf(['fire', 'flame', 'hot', 'lit', 'snapstreak'])
      expect(emojis.emojiToName['🐈']).to.be.oneOf(['cat', 'domestic_cat', 'domesticcat', 'feline', 'housecat'])
      expect(emojis.reverseMapping['🍕']).to.equal('pizza')
    })
  })
})
