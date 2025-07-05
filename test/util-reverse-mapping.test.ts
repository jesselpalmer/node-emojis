import { expect } from 'chai'
import { 
  createReverseMapping, 
  getNameFromEmoji, 
  isKnownEmoji,
  getReverseMapping 
} from '../lib/utils/reverse-mapping'

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

  describe('getNameFromEmoji function', () => {
    it('should get emoji name from valid emoji', () => {
      // Note: when multiple names map to the same emoji, the last one in the data wins
      expect(getNameFromEmoji('🔥')).to.be.oneOf(['fire', 'flame', 'hot', 'lit', 'snapstreak'])
      expect(getNameFromEmoji('🐈')).to.be.oneOf(['cat', 'domestic_cat', 'domesticcat', 'feline', 'housecat'])
      expect(getNameFromEmoji('😀')).to.be.oneOf(['grinning', 'grinning_face'])
    })

    it('should return undefined for unknown emoji', () => {
      expect(getNameFromEmoji('🦖')).to.be.undefined
      expect(getNameFromEmoji('not_an_emoji')).to.be.undefined
      expect(getNameFromEmoji('')).to.be.undefined
    })

    it('should work with emojis that have variation selectors', () => {
      // Some emojis have variation selectors, test both forms
      const heartName = getNameFromEmoji('❤️')
      const plainHeartName = getNameFromEmoji('❤')
      
      // At least one should work
      expect(heartName || plainHeartName).to.exist
    })
  })

  describe('isKnownEmoji function', () => {
    it('should return true for known emojis', () => {
      expect(isKnownEmoji('🔥')).to.be.true
      expect(isKnownEmoji('🐈')).to.be.true
      expect(isKnownEmoji('😀')).to.be.true
    })

    it('should return false for unknown emojis', () => {
      expect(isKnownEmoji('🦖')).to.be.false
      expect(isKnownEmoji('not_an_emoji')).to.be.false
      expect(isKnownEmoji('')).to.be.false
    })
  })

  describe('getReverseMapping function', () => {
    it('should return the complete reverse mapping', () => {
      const mapping = getReverseMapping()
      
      expect(mapping).to.be.an('object')
      expect(Object.keys(mapping).length).to.be.greaterThan(100) // Should have many emojis
      
      // Check some known mappings
      expect(mapping['🔥']).to.be.oneOf(['fire', 'flame', 'hot', 'lit', 'snapstreak'])
      expect(mapping['🐈']).to.be.oneOf(['cat', 'domestic_cat', 'domesticcat', 'feline', 'housecat'])
    })

    it('should return a frozen object to prevent mutations', () => {
      const mapping = getReverseMapping()
      
      expect(() => {
        (mapping as any)['🔥'] = 'modified'
      }).to.throw()
    })

    it('should return a new object each time', () => {
      const mapping1 = getReverseMapping()
      const mapping2 = getReverseMapping()
      
      expect(mapping1).to.not.equal(mapping2)
      expect(mapping1).to.deep.equal(mapping2)
    })
  })
})
