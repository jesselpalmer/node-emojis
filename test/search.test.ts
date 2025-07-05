import { expect } from 'chai'
import emojis from '../lib'

describe('search functions', () => {
  it('should have searchByKeyword function', () => {
    expect(emojis).to.have.property('searchByKeyword')
    expect(emojis.searchByKeyword).to.be.a('function')
  })

  it('should have getByCategory function', () => {
    expect(emojis).to.have.property('getByCategory')
    expect(emojis.getByCategory).to.be.a('function')
  })

  it('should have getAllNames function', () => {
    expect(emojis).to.have.property('getAllNames')
    expect(emojis.getAllNames).to.be.a('function')
  })

  it('should search by keyword correctly', () => {
    const results = emojis.searchByKeyword('fire')
    expect(results).to.be.an('array')
    expect(results.length).to.be.greaterThan(0)

    // Should find fire emoji
    const fireResult = results.find(r => r.name === 'fire')
    expect(fireResult).to.exist
    expect(fireResult!.emoji).to.equal('🔥')
    expect(fireResult!.metadata).to.have.property('keywords')
    expect(fireResult!.metadata.keywords).to.include('fire')
  })

  it('should search case-insensitively', () => {
    const upperResults = emojis.searchByKeyword('FIRE')
    const lowerResults = emojis.searchByKeyword('fire')
    expect(upperResults).to.deep.equal(lowerResults)
  })

  it('should return empty array for non-existent keyword', () => {
    const results = emojis.searchByKeyword('nonexistentkeyword123')
    expect(results).to.be.an('array')
    expect(results.length).to.equal(0)
  })

  it('should get emojis by category', () => {
    const animals = emojis.getByCategory('animals')
    expect(animals).to.be.an('array')
    expect(animals.length).to.be.greaterThan(0)

    // All results should be animals
    animals.forEach(result => {
      expect(result.metadata.category).to.equal('animals')
      expect(result).to.have.property('name')
      expect(result).to.have.property('emoji')
      expect(result).to.have.property('metadata')
    })
  })

  it('should get emojis for all categories', () => {
    const categories = ['animals', 'food', 'nature', 'people', 'travel']

    categories.forEach(category => {
      const results = emojis.getByCategory(category)
      expect(results).to.be.an('array')
      expect(results.length).to.be.greaterThan(0)

      results.forEach(result => {
        expect(result.metadata.category).to.equal(category)
      })
    })
  })

  it('should find partial keyword matches', () => {
    const results = emojis.searchByKeyword('ani')
    expect(results).to.be.an('array')

    // Should find emojis with keywords containing 'ani' (like 'animal')
    const hasMatch = results.some((result: any) =>
      result.metadata.keywords.some((keyword: string) => keyword.includes('ani'))
    )
    expect(hasMatch).to.equal(true)
  })

  it('should return all emoji names', () => {
    const names = emojis.getAllNames()
    expect(names).to.be.an('array')
    expect(names.length).to.be.greaterThan(0)

    // Should include some known emojis
    expect(names).to.include('fire')
    expect(names).to.include('smile')
    expect(names).to.include('pizza')

    // Should match the number of emojis in metadata
    expect(names.length).to.equal(Object.keys(emojis.metadata).length)

    // All names should be strings
    names.forEach(name => {
      expect(name).to.be.a('string')
    })
  })
})
