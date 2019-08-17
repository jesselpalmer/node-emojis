/* eslint-env mocha */

const expect = require('chai').expect
const emojis = require('../lib/emojis')

describe('emojis', () => {
  it('should return a successful animal emoji', () => {
    expect(emojis.cat).to.equal('🐈')
  })

  it('should return a successful people emoji', () => {
    expect(emojis.grin).to.equal('😁')
  })

  it('should return a successful travel emoji', () => {
    expect(emojis.snow_capped_mountain).to.equal('🗻')
  })

  it('should return a successful food emoji', () => {
    expect(emojis.melon).to.equal('🍈')
  })

  it('should return a successful nature emoji', () => {
    expect(emojis.lit).to.equal('🔥')
  })
})
