import { expect } from 'chai'
import {
  aliases,
  getAliases,
  getPrimaryName,
  isSameEmoji,
  getAllNames
} from '../lib/features/aliases'

describe('aliases feature module', () => {
  describe('aliases export', () => {
    it('should export aliases object', () => {
      expect(aliases).to.be.an('object')
      expect(Object.keys(aliases).length).to.be.greaterThan(0)
    })
  })

  describe('getAliases function', () => {
    it('should return aliases for primary name', () => {
      const fireAliases = getAliases('fire')
      expect(fireAliases).to.be.an('array')
      expect(fireAliases.length).to.be.greaterThan(0)
      expect(fireAliases).to.include('flame')
      expect(fireAliases).to.include('hot')
    })

    it('should return related names when given an alias', () => {
      const aliases = getAliases('flame')
      expect(aliases).to.be.an('array')
      expect(aliases).to.include('fire')
      expect(aliases).to.include('hot')
    })

    it('should return empty array for emoji with no aliases', () => {
      const aliases = getAliases('ant')
      expect(aliases).to.be.an('array')
      expect(aliases.length).to.equal(0)
    })
  })

  describe('getPrimaryName function', () => {
    it('should return same name if already primary', () => {
      expect(getPrimaryName('fire')).to.equal('fire')
      expect(getPrimaryName('cat')).to.equal('cat')
    })

    it('should return primary name for aliases', () => {
      expect(getPrimaryName('flame')).to.equal('fire')
      expect(getPrimaryName('hot')).to.equal('fire')
      expect(getPrimaryName('doggo')).to.equal('dog')
    })

    it('should return input for unknown names', () => {
      expect(getPrimaryName('unknown_emoji_xyz')).to.equal('unknown_emoji_xyz')
    })
  })

  describe('isSameEmoji function', () => {
    it('should return true for identical names', () => {
      expect(isSameEmoji('fire', 'fire')).to.be.true
      expect(isSameEmoji('cat', 'cat')).to.be.true
    })

    it('should return true for aliases of same emoji', () => {
      expect(isSameEmoji('fire', 'flame')).to.be.true
      expect(isSameEmoji('flame', 'hot')).to.be.true
      expect(isSameEmoji('hot', 'fire')).to.be.true
    })

    it('should return false for different emojis', () => {
      expect(isSameEmoji('fire', 'water')).to.be.false
      expect(isSameEmoji('cat', 'dog')).to.be.false
    })

    it('should handle unknown names', () => {
      expect(isSameEmoji('unknown1', 'unknown2')).to.be.false
      expect(isSameEmoji('unknown', 'unknown')).to.be.true
    })
  })

  describe('getAllNames function', () => {
    it('should return all names including aliases', () => {
      const fireNames = getAllNames('fire')
      expect(fireNames).to.be.an('array')
      expect(fireNames).to.include('fire')
      expect(fireNames).to.include('flame')
      expect(fireNames).to.include('hot')
      expect(fireNames).to.include('lit')
    })

    it('should work when given an alias', () => {
      const names = getAllNames('flame')
      expect(names).to.be.an('array')
      expect(names).to.include('fire')
      expect(names).to.include('flame')
    })

    it('should return single name for emoji without aliases', () => {
      const names = getAllNames('ant')
      expect(names).to.be.an('array')
      expect(names).to.deep.equal(['ant'])
    })

    it('should handle unknown names', () => {
      const names = getAllNames('unknown_xyz')
      expect(names).to.deep.equal(['unknown_xyz'])
    })
  })
})
