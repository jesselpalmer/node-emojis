import { expect } from 'chai'
import {
  filterByCategory,
  filterByVersion,
  filterByKeyword
} from '../lib/features/filters'

describe('filters feature module', () => {
  describe('filterByCategory function', () => {
    it('should filter emojis by category', () => {
      const animals = filterByCategory('animals')
      expect(animals).to.be.an('array')
      expect(animals.length).to.be.greaterThan(0)

      animals.forEach(emoji => {
        expect(emoji).to.have.property('name')
        expect(emoji).to.have.property('emoji')
        expect(emoji).to.have.property('category', 'animals')
        expect(emoji).to.have.property('keywords')
        expect(emoji).to.have.property('unicodeVersion')
      })

      // Check for specific animals
      const cat = animals.find(e => e.name === 'cat')
      expect(cat).to.exist
      expect(cat!.emoji).to.equal('🐈')
    })

    it('should return empty array for invalid category', () => {
      const results = filterByCategory('nonexistent' as any)
      expect(results).to.be.an('array')
      expect(results.length).to.equal(0)
    })

    it('should handle all standard categories', () => {
      const categories = ['animals', 'people', 'food', 'nature', 'travel']

      categories.forEach(category => {
        const results = filterByCategory(category as any)
        expect(results).to.be.an('array')
        expect(results.length).to.be.greaterThan(0)
      })
    })
  })

  describe('filterByVersion function', () => {
    it('should filter emojis by minimum version', () => {
      const modern = filterByVersion('12.0')
      expect(modern).to.be.an('array')

      modern.forEach(emoji => {
        const version = parseFloat(emoji.unicodeVersion)
        expect(version).to.be.at.least(12.0)
      })
    })

    it('should return all emojis for version 1.0', () => {
      const all = filterByVersion('1.0')
      expect(all).to.be.an('array')
      expect(all.length).to.be.greaterThan(100) // Should have many emojis
    })

    it('should return empty array for very high version', () => {
      const future = filterByVersion('99.0')
      expect(future).to.be.an('array')
      expect(future.length).to.equal(0)
    })

    it('should handle version comparison correctly', () => {
      const v6 = filterByVersion('6.0')
      const v11 = filterByVersion('11.0')

      expect(v6.length).to.be.greaterThan(v11.length)
    })
  })

  describe('filterByKeyword function', () => {
    it('should filter emojis containing keyword', () => {
      const happy = filterByKeyword('happy')
      expect(happy).to.be.an('array')
      expect(happy.length).to.be.greaterThan(0)

      happy.forEach(emoji => {
        const hasKeyword = emoji.keywords.some(k => k.includes('happy'))
        expect(hasKeyword).to.be.true
      })
    })

    it('should be case insensitive', () => {
      const lower = filterByKeyword('happy')
      const upper = filterByKeyword('HAPPY')

      expect(lower.length).to.equal(upper.length)
    })

    it('should return empty array for no matches', () => {
      const results = filterByKeyword('xyznonexistent')
      expect(results).to.be.an('array')
      expect(results.length).to.equal(0)
    })

    it('should find partial matches', () => {
      const results = filterByKeyword('hap')
      expect(results.length).to.be.greaterThan(0)

      // Should find emojis with keywords containing 'hap'
      results.forEach(emoji => {
        const hasMatch = emoji.keywords.some(k => k.includes('hap'))
        expect(hasMatch).to.be.true
      })
    })
  })
})
