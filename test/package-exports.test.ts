import { expect } from 'chai'
import { execFileSync } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'
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

  it('exposes every root export to native ESM named imports', () => {
    // Node's CommonJS export detection only sees explicitly named exports.
    // A feature export missing from the explicit list in src/index.ts would
    // work with require() but throw on `import { name } from 'node-emojis'`.
    // Import the built package in a real ESM context and compare.
    const entry = pathToFileURL(path.join(__dirname, '../lib/index.js')).href
    const script = [
      `import * as ns from ${JSON.stringify(entry)}`,
      'import { createRequire } from "module"',
      `const cjs = createRequire(import.meta.url)(${JSON.stringify(path.join(__dirname, '../lib/index.js'))})`,
      // Node 23+ also exposes the whole CommonJS object as 'module.exports'
      'const special = ["default", "__esModule", "module.exports"]',
      'const names = Object.keys(ns).filter((n) => !special.includes(n))',
      'const mismatched = names.filter((n) => ns[n] !== cjs[n])',
      'console.log(JSON.stringify({ names, mismatched, defaultOk: ns.default === cjs }))'
    ].join('\n')
    const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      encoding: 'utf8'
    })
    const result = JSON.parse(output)

    expect(result.defaultOk, 'ESM default import is the legacy object').to.equal(true)
    expect(result.mismatched, 'ESM values differ from require()').to.deep.equal([])
    Object.values(featureModules).forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        expect(result.names, `${name} is not an ESM named export`).to.include(name)
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
