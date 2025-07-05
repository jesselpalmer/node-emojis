import { expect } from 'chai'
import emojis from '../lib'

describe('alias support', () => {
  it('should have alias functions', () => {
    expect(emojis).to.have.property('aliases')
    expect(emojis).to.have.property('getAliases')
    expect(emojis).to.have.property('getPrimaryName')
    expect(emojis).to.have.property('isSameEmoji')
    expect(emojis).to.have.property('getAllNamesForEmoji')
  })

  describe('aliases property', () => {
    it('should be an object with emoji aliases', () => {
      expect(emojis.aliases).to.be.an('object')
      expect(emojis.aliases.grinning).to.be.an('array')
      expect(emojis.aliases.grinning).to.include('grinning_face')
    })

    it('should have aliases for common emojis', () => {
      expect(emojis.aliases.joy).to.include('face_with_tears_of_joy')
      expect(emojis.aliases.joy).to.include('laughing')
      expect(emojis.aliases.joy).to.include('satisfied')

      expect(emojis.aliases.thumbs_up).to.include('thumbsup')
      expect(emojis.aliases.thumbs_up).to.include('+1')

      expect(emojis.aliases.fire).to.include('flame')
      expect(emojis.aliases.fire).to.include('hot')
      expect(emojis.aliases.fire).to.include('lit')
    })
  })

  describe('getAliases', () => {
    it('should return aliases for a primary name', () => {
      const joyAliases = emojis.getAliases('joy')
      expect(joyAliases).to.be.an('array')
      expect(joyAliases).to.include('face_with_tears_of_joy')
      expect(joyAliases).to.include('laughing')
      expect(joyAliases).to.include('satisfied')
    })

    it('should return related names when given an alias', () => {
      const aliases = emojis.getAliases('laughing')
      expect(aliases).to.include('joy')
      expect(aliases).to.include('face_with_tears_of_joy')
      expect(aliases).to.include('satisfied')
      expect(aliases).to.not.include('laughing') // Should not include itself
    })

    it('should return empty array for emoji with no aliases', () => {
      const aliases = emojis.getAliases('pizza')
      expect(aliases).to.be.an('array')
      expect(aliases).to.have.lengthOf(0)
    })
  })

  describe('getPrimaryName', () => {
    it('should return the same name if already primary', () => {
      expect(emojis.getPrimaryName('joy')).to.equal('joy')
      expect(emojis.getPrimaryName('fire')).to.equal('fire')
      expect(emojis.getPrimaryName('thumbs_up')).to.equal('thumbs_up')
    })

    it('should return primary name for aliases', () => {
      expect(emojis.getPrimaryName('laughing')).to.equal('joy')
      expect(emojis.getPrimaryName('satisfied')).to.equal('joy')
      expect(emojis.getPrimaryName('thumbsup')).to.equal('thumbs_up')
      expect(emojis.getPrimaryName('+1')).to.equal('thumbs_up')
      expect(emojis.getPrimaryName('flame')).to.equal('fire')
    })

    it('should return input for unknown names', () => {
      expect(emojis.getPrimaryName('unknown_emoji')).to.equal('unknown_emoji')
    })
  })

  describe('isSameEmoji', () => {
    it('should return true for identical names', () => {
      expect(emojis.isSameEmoji('joy', 'joy')).to.equal(true)
      expect(emojis.isSameEmoji('fire', 'fire')).to.equal(true)
    })

    it('should return true for aliases of the same emoji', () => {
      expect(emojis.isSameEmoji('joy', 'laughing')).to.equal(true)
      expect(emojis.isSameEmoji('laughing', 'satisfied')).to.equal(true)
      expect(emojis.isSameEmoji('thumbs_up', 'thumbsup')).to.equal(true)
      expect(emojis.isSameEmoji('thumbsup', '+1')).to.equal(true)
      expect(emojis.isSameEmoji('fire', 'flame')).to.equal(true)
    })

    it('should return false for different emojis', () => {
      expect(emojis.isSameEmoji('joy', 'smile')).to.equal(false)
      expect(emojis.isSameEmoji('fire', 'water')).to.equal(false)
      expect(emojis.isSameEmoji('thumbs_up', 'thumbs_down')).to.equal(false)
    })
  })

  describe('getAllNamesForEmoji', () => {
    it('should return all names for an emoji with aliases', () => {
      const joyNames = emojis.getAllNamesForEmoji('joy')
      expect(joyNames).to.include('joy')
      expect(joyNames).to.include('face_with_tears_of_joy')
      expect(joyNames).to.include('laughing')
      expect(joyNames).to.include('satisfied')
      expect(joyNames[0]).to.equal('joy') // Primary name should be first
    })

    it('should work when given an alias', () => {
      const names = emojis.getAllNamesForEmoji('laughing')
      expect(names).to.include('joy')
      expect(names).to.include('face_with_tears_of_joy')
      expect(names).to.include('laughing')
      expect(names).to.include('satisfied')
      expect(names[0]).to.equal('joy') // Primary name should be first
    })

    it('should return single name for emoji without aliases', () => {
      const names = emojis.getAllNamesForEmoji('pizza')
      expect(names).to.deep.equal(['pizza'])
    })
  })

  describe('emoji access via aliases', () => {
    it('should be able to access emojis using any alias', () => {
      // Note: These are separate emojis in the current implementation
      // They have been defined as aliases conceptually but map to different Unicode points

      // The joy emoji and its related emojis
      expect(emojis.joy).to.be.a('string')
      expect(emojis.laughing).to.be.a('string')
      expect(emojis.satisfied).to.be.a('string')

      // Thumbs up aliases - these are actual aliases pointing to same emoji
      const thumbsUpEmoji = emojis.thumbs_up
      expect(emojis.thumbsup).to.equal(thumbsUpEmoji)
      expect(emojis['+1']).to.equal(thumbsUpEmoji)

      // Fire aliases
      const fireEmoji = emojis.fire
      expect(emojis.flame).to.equal(fireEmoji)
      expect(emojis.hot).to.equal(fireEmoji)
      expect(emojis.lit).to.equal(fireEmoji)
      expect(emojis.snapstreak).to.equal(fireEmoji)
    })
  })

  describe('integration with search', () => {
    it('should find emojis by any of their aliases', () => {
      // Search for 'laughing' should find the joy emoji
      const laughingResults = emojis.searchByKeyword('laughing')
      const joyResult = laughingResults.find(r => emojis.isSameEmoji(r.name, 'joy'))
      expect(joyResult).to.exist

      // Search for 'thumbsup' should find thumbs_up
      const thumbsupResults = emojis.searchByKeyword('thumbsup')
      const thumbsUpResult = thumbsupResults.find(r => emojis.isSameEmoji(r.name, 'thumbs_up'))
      expect(thumbsUpResult).to.exist
    })
  })

  describe('common alias examples', () => {
    it('should support face emoji aliases', () => {
      expect(emojis.getPrimaryName('grinning_face')).to.equal('grinning')
      expect(emojis.getPrimaryName('smiling_face_with_open_mouth')).to.equal('smile')
      expect(emojis.getPrimaryName('mind_blown')).to.equal('exploding_head')
      expect(emojis.getPrimaryName('starstruck')).to.equal('star_struck')
    })

    it('should support animal emoji aliases', () => {
      expect(emojis.getPrimaryName('doggo')).to.equal('dog')
      expect(emojis.getPrimaryName('domestic_cat')).to.equal('cat')
      expect(emojis.getPrimaryName('honeybee')).to.equal('bee')
    })

    it('should support food emoji aliases', () => {
      expect(emojis.getPrimaryName('red_apple')).to.equal('apple')
      expect(emojis.getPrimaryName('burger')).to.equal('hamburger')
      expect(emojis.getPrimaryName('hotdog')).to.equal('hot_dog')
    })
  })
})
