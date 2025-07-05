import { expect } from 'chai'
import { createReverseMapping } from '../lib/utils/reverse-mapping'

describe('reverse-mapping utility', () => {
  describe('createReverseMapping function', () => {
    it('should create reverse mapping from emojis', () => {
      const emojis = {
        fire: '🔥',
        cat: '🐈',
        pizza: '🍕'
      }

      const reverse = createReverseMapping(emojis)

      expect(reverse).to.be.an('object')
      expect(reverse['🔥']).to.equal('fire')
      expect(reverse['🐈']).to.equal('cat')
      expect(reverse['🍕']).to.equal('pizza')
    })

    it('should handle empty object', () => {
      const reverse = createReverseMapping({})
      expect(reverse).to.be.an('object')
      expect(Object.keys(reverse).length).to.equal(0)
    })

    it('should handle duplicate emoji values', () => {
      const emojis = {
        fire: '🔥',
        flame: '🔥', // Same emoji
        hot: '🔥'
      }

      const reverse = createReverseMapping(emojis)

      // Should map to the last occurrence
      expect(reverse['🔥']).to.equal('hot')
    })

    it('should handle special characters in emojis', () => {
      const emojis = {
        family: '👨‍👩‍👧‍👦', // Complex emoji with ZWJ
        wave_light: '👋🏻', // Emoji with skin tone
        heart: '❤️' // Emoji with variation selector
      }

      const reverse = createReverseMapping(emojis)

      expect(reverse['👨‍👩‍👧‍👦']).to.equal('family')
      expect(reverse['👋🏻']).to.equal('wave_light')
      expect(reverse['❤️']).to.equal('heart')
    })

    it('should maintain referential integrity', () => {
      const emojis = {
        smile: '😄',
        grin: '😁'
      }

      const reverse1 = createReverseMapping(emojis)
      const reverse2 = createReverseMapping(emojis)

      // Should create new objects each time
      expect(reverse1).to.not.equal(reverse2)
      expect(reverse1).to.deep.equal(reverse2)
    })
  })
})
