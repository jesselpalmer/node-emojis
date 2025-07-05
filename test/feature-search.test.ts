import { expect } from 'chai'
import { search, getByCategory, getCategories, SearchResult } from '../lib/features/search'

describe('search feature module', () => {
  describe('search function', () => {
    it('should find emojis by name', () => {
      const results = search('fire')
      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)

      const fireResult = results.find((r: SearchResult) => r.name === 'fire')
      expect(fireResult).to.exist
      expect(fireResult!.emoji).to.equal('🔥')
      expect(fireResult!.keywords).to.include('fire')
      expect(fireResult!.score).to.equal(1.0) // Name match should have highest score
    })

    it('should find emojis by keyword', () => {
      const results = search('happy')
      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)

      // At least one result should have 'happy' in keywords
      const hasHappyKeyword = results.some((result: SearchResult) =>
        result.keywords.some((k: string) => k.toLowerCase().includes('happy'))
      )
      expect(hasHappyKeyword).to.be.true

      // Check a specific known emoji
      const blushResult = results.find((r: SearchResult) => r.name === 'blush')
      expect(blushResult).to.exist
      expect(blushResult!.keywords).to.include('happy')
    })

    it('should find emojis by alias', () => {
      const results = search('doggo')
      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)

      // Should find the dog emoji
      const dogResult = results.find((r: SearchResult) => r.name === 'dog')
      expect(dogResult).to.exist
      expect(dogResult!.emoji).to.equal('🐕')
    })

    it('should be case insensitive', () => {
      const lowerResults = search('fire')
      const upperResults = search('FIRE')

      expect(lowerResults.length).to.equal(upperResults.length)
      expect(lowerResults.map((r: SearchResult) => r.name).sort()).to.deep.equal(
        upperResults.map((r: SearchResult) => r.name).sort()
      )
    })

    it('should sort results by score', () => {
      const results = search('fire')

      // First result should have highest score
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score || 0).to.be.at.least(results[i].score || 0)
      }
    })

    it('should return empty array for no matches', () => {
      const results = search('xyznonexistent')
      expect(results).to.be.an('array')
      expect(results.length).to.equal(0)
    })
  })

  describe('getByCategory function', () => {
    it('should return all emojis in a category', () => {
      const animals = getByCategory('animals')
      expect(animals).to.be.an('array')
      expect(animals.length).to.be.greaterThan(0)

      // All results should be in animals category
      animals.forEach(result => {
        expect(result.category).to.equal('animals')
      })

      // Should include known animals
      const catEmoji = animals.find((r: SearchResult) => r.name === 'cat')
      expect(catEmoji).to.exist
      expect(catEmoji!.emoji).to.equal('🐈')
    })

    it('should return empty array for invalid category', () => {
      const results = getByCategory('nonexistent')
      expect(results).to.be.an('array')
      expect(results.length).to.equal(0)
    })
  })

  describe('getCategories function', () => {
    it('should return all available categories', () => {
      const categories = getCategories()
      expect(categories).to.be.an('array')
      expect(categories.length).to.be.greaterThan(0)

      // Should include known categories
      expect(categories).to.include('animals')
      expect(categories).to.include('people')
      expect(categories).to.include('food')
      expect(categories).to.include('nature')
      expect(categories).to.include('travel')

      // Should be sorted
      const sorted = [...categories].sort()
      expect(categories).to.deep.equal(sorted)
    })
  })
})
