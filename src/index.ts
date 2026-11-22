/**
 * node-emojis - Complete emoji library for Node.js
 * 
 * This module provides both modern tree-shakeable exports and backward compatibility
 * with the v0.x API for smooth migration.
 * 
 * Modern usage (tree-shakeable):
 * ```
 * import { search } from 'node-emojis'
 * import { applySkinTone } from 'node-emojis'
 * ```
 * 
 * Legacy usage (backward compatible):
 * ```
 * const emojis = require('node-emojis')
 * console.log(emojis.fire) // 🔥
 * ```
 */

// Re-export all modern features for tree-shaking
export * from './features/search'
export * from './features/skin-tones'
export * from './features/aliases'
export * from './features/filters'

// Re-export utilities
export * from './utils/reverse-mapping'
export * from './utils/validators'

// Re-export types
export * from './core/emoji'

// Import backward compatibility API
import { createBackwardCompatibleAPI, EmojisMain } from './backward-compat'

import * as searchFeature from './features/search'
import * as skinTonesFeature from './features/skin-tones'
import * as aliasesFeature from './features/aliases'
import * as filtersFeature from './features/filters'
import * as reverseMappingUtils from './utils/reverse-mapping'
import * as validatorUtils from './utils/validators'

// Create the default export with backward compatibility
const emojis: EmojisMain = createBackwardCompatibleAPI()

// Explicit exports of every runtime value. Assigning them by name
// (compiled to `exports.name = ...`) lets Node's CommonJS export detection
// see them, so `import { search } from 'node-emojis'` works in native ESM.
// The `export *` lines above still carry the type exports. Keep this list in
// sync with the feature modules (test/package-exports.test.ts checks it).
export const search = searchFeature.search
export const getCategories = searchFeature.getCategories

export const SKIN_TONE_MODIFIERS = skinTonesFeature.SKIN_TONE_MODIFIERS
export const SKIN_TONE_CAPABLE_EMOJIS = skinTonesFeature.SKIN_TONE_CAPABLE_EMOJIS
export const applySkinTone = skinTonesFeature.applySkinTone
export const supportsSkinTone = skinTonesFeature.supportsSkinTone
export const getAllSkinToneVariations = skinTonesFeature.getAllSkinToneVariations
export const removeSkinTone = skinTonesFeature.removeSkinTone

export const aliases = aliasesFeature.aliases
export const getAliases = aliasesFeature.getAliases
export const getPrimaryName = aliasesFeature.getPrimaryName
export const isSameEmoji = aliasesFeature.isSameEmoji
export const resolveEmoji = aliasesFeature.resolveEmoji
export const getAliasMap = aliasesFeature.getAliasMap

export const filterByCategory = filtersFeature.filterByCategory
export const filterByVersion = filtersFeature.filterByVersion
export const filterByKeyword = filtersFeature.filterByKeyword
export const getUnicodeVersions = filtersFeature.getUnicodeVersions

export const getNameFromEmoji = reverseMappingUtils.getNameFromEmoji
export const getReverseMapping = reverseMappingUtils.getReverseMapping
export const isKnownEmoji = reverseMappingUtils.isKnownEmoji
export const createReverseMapping = reverseMappingUtils.createReverseMapping

export const isValidEmoji = validatorUtils.isValidEmoji
export const isValidEmojiName = validatorUtils.isValidEmojiName
export const isValidSkinTone = validatorUtils.isValidSkinTone
export const sanitizeEmojiName = validatorUtils.sanitizeEmojiName
export const hasVariationSelector = validatorUtils.hasVariationSelector
export const stripVariationSelectors = validatorUtils.stripVariationSelectors

// `getByCategory` and `getAllNames` exist on the legacy object with v0.x
// semantics, and the legacy versions win at the package root. The modern
// versions are available from 'node-emojis/search' and 'node-emojis/aliases'.
export const getByCategory: EmojisMain['getByCategory'] = emojis.getByCategory
export const getAllNames: EmojisMain['getAllNames'] = emojis.getAllNames

// Attach every named export to the legacy object as a non-enumerable
// property, so `require('node-emojis').search` works while
// `Object.keys(require('node-emojis'))` still lists only emoji names.
// Legacy properties are never overwritten.
const namedExports: Record<string, unknown> = Object.assign(
  {},
  searchFeature,
  skinTonesFeature,
  aliasesFeature,
  filtersFeature,
  reverseMappingUtils,
  validatorUtils
)
for (const name of Object.keys(namedExports)) {
  if (!Object.prototype.hasOwnProperty.call(emojis, name)) {
    Object.defineProperty(emojis, name, {
      value: namedExports[name],
      enumerable: false,
      writable: true,
      configurable: true
    })
  }
}

// For CommonJS compatibility, the module itself is the legacy emojis object
module.exports = emojis

// Also export as default for ES modules
module.exports.default = emojis

// Export the type
export default emojis
