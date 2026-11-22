import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import * as searchFeature from '../lib/features/search'
import * as skinTonesFeature from '../lib/features/skin-tones'
import * as aliasesFeature from '../lib/features/aliases'
import * as filtersFeature from '../lib/features/filters'
import * as reverseMappingUtils from '../lib/utils/reverse-mapping'
import * as validatorUtils from '../lib/utils/validators'
import emojiData from '../lib/data/emojis.json'

// Regression tests for issue #23. These load the *built* package root with
// require(), exactly as a CommonJS consumer would, because the bug lived in
// the interaction between `module.exports = emojis` and the compiled
// re-exports, which source-level tests never exercised.
const root = require('../lib/index.js')

// Names where the legacy (v0.x) method on the root object intentionally
// differs from the modern feature function of the same name.
const LEGACY_OVERRIDES = ['getByCategory', 'getAllNames']

const featureModules: Record<string, Record<string, unknown>> = {
  search: searchFeature,
  'skin-tones': skinTonesFeature,
  aliases: aliasesFeature,
  filters: filtersFeature,
  'reverse-mapping': reverseMappingUtils,
  validators: validatorUtils
}

describe('package root exports (issue #23)', () => {
  it('keeps legacy emoji property access', () => {
    expect(root.fire).to.equal('🔥')
    expect(root['+1']).to.equal('👍')
    expect(root.default).to.equal(root)
  })

  it('keeps Object.keys() unchanged from 1.0.0 (emoji names plus default)', () => {
    // 1.0.0 also listed the enumerable `default` property; named exports
    // must not add anything else.
    expect(Object.keys(root)).to.deep.equal([...Object.keys(emojiData), 'default'])
  })

  Object.entries(featureModules).forEach(([moduleName, mod]) => {
    Object.keys(mod).forEach((name) => {
      if (LEGACY_OVERRIDES.includes(name)) return

      it(`exposes ${name} from ${moduleName} at the root`, () => {
        expect(root[name], name).to.not.equal(undefined)
        // Legacy wrappers are kept where they already existed; otherwise the
        // root export is the feature export itself.
        if (typeof mod[name] === 'function') {
          expect(root[name]).to.be.a('function')
        } else {
          expect(root[name]).to.deep.equal(mod[name])
        }
      })
    })
  })

  it('lists every root export by name so native ESM can detect it', () => {
    // Node's CommonJS export detection only sees explicitly named exports.
    // A feature export missing from the explicit list in src/index.ts would
    // work with require() but throw on `import { name } from 'node-emojis'`.
    const compiled: string = fs.readFileSync(
      path.join(__dirname, '../lib/index.js'),
      'utf8'
    )
    Object.values(featureModules).forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        expect(
          compiled.includes(`exports.${name} =`) ||
            compiled.includes(`Object.defineProperty(exports, "${name}"`),
          `${name} is not explicitly exported from src/index.ts`
        ).to.equal(true)
      })
    })
  })

  it('works for documented root utilities', () => {
    expect(root.search('fire')).to.be.an('array').that.is.not.empty
    expect(root.getNameFromEmoji('🔥')).to.be.a('string')
    expect(root.isValidEmoji('🔥')).to.equal(true)
    expect(root.isValidEmojiName('fire')).to.equal(true)
    expect(root.filterByCategory('food')).to.be.an('array').that.is.not.empty
  })

  it('keeps the legacy getByCategory and getAllNames behavior', () => {
    const [first] = root.getByCategory('animals')
    expect(first).to.have.keys(['name', 'emoji', 'metadata'])
    expect(root.getAllNames()).to.deep.equal(Object.keys(emojiData))
  })
})
