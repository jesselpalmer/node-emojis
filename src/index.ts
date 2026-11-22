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

// Explicit exports of every runtime value. Assigning them by name
// (compiled to `exports.name = ...`) lets Node's CommonJS export detection
// see them, so `import { search } from 'node-emojis'` works in native ESM.
// Values are read from the legacy object, which is what both require() and
// ESM consumers actually receive, so there is one source of truth. The
// `export *` lines above still carry the type exports. Keep this list in
// sync with the feature modules (test/package-exports.test.ts checks it).
export const search = emojis.search as typeof searchFeature.search
export const getCategories = emojis.getCategories as typeof searchFeature.getCategories

export const SKIN_TONE_MODIFIERS = emojis.SKIN_TONE_MODIFIERS as typeof skinTonesFeature.SKIN_TONE_MODIFIERS
export const SKIN_TONE_CAPABLE_EMOJIS = emojis.SKIN_TONE_CAPABLE_EMOJIS as typeof skinTonesFeature.SKIN_TONE_CAPABLE_EMOJIS
export const applySkinTone = emojis.applySkinTone as typeof skinTonesFeature.applySkinTone
export const supportsSkinTone = emojis.supportsSkinTone as typeof skinTonesFeature.supportsSkinTone
export const getAllSkinToneVariations = emojis.getAllSkinToneVariations as typeof skinTonesFeature.getAllSkinToneVariations
export const removeSkinTone = emojis.removeSkinTone as typeof skinTonesFeature.removeSkinTone

export const aliases = emojis.aliases as typeof aliasesFeature.aliases
export const getAliases = emojis.getAliases as typeof aliasesFeature.getAliases
export const getPrimaryName = emojis.getPrimaryName as typeof aliasesFeature.getPrimaryName
export const isSameEmoji = emojis.isSameEmoji as typeof aliasesFeature.isSameEmoji
export const resolveEmoji = emojis.resolveEmoji as typeof aliasesFeature.resolveEmoji
export const getAliasMap = emojis.getAliasMap as typeof aliasesFeature.getAliasMap

export const filterByCategory = emojis.filterByCategory as typeof filtersFeature.filterByCategory
export const filterByVersion = emojis.filterByVersion as typeof filtersFeature.filterByVersion
export const filterByKeyword = emojis.filterByKeyword as typeof filtersFeature.filterByKeyword
export const getUnicodeVersions = emojis.getUnicodeVersions as typeof filtersFeature.getUnicodeVersions

export const getNameFromEmoji = emojis.getNameFromEmoji as typeof reverseMappingUtils.getNameFromEmoji
export const getReverseMapping = emojis.getReverseMapping as typeof reverseMappingUtils.getReverseMapping
export const isKnownEmoji = emojis.isKnownEmoji as typeof reverseMappingUtils.isKnownEmoji
export const createReverseMapping = emojis.createReverseMapping as typeof reverseMappingUtils.createReverseMapping

export const isValidEmoji = emojis.isValidEmoji as typeof validatorUtils.isValidEmoji
export const isValidEmojiName = emojis.isValidEmojiName as typeof validatorUtils.isValidEmojiName
export const isValidSkinTone = emojis.isValidSkinTone as typeof validatorUtils.isValidSkinTone
export const sanitizeEmojiName = emojis.sanitizeEmojiName as typeof validatorUtils.sanitizeEmojiName
export const hasVariationSelector = emojis.hasVariationSelector as typeof validatorUtils.hasVariationSelector
export const stripVariationSelectors = emojis.stripVariationSelectors as typeof validatorUtils.stripVariationSelectors

// `getByCategory` and `getAllNames` exist on the legacy object with v0.x
// semantics, and the legacy versions win at the package root. The modern
// versions are available from 'node-emojis/search' and 'node-emojis/aliases'.
export const getByCategory: EmojisMain['getByCategory'] = emojis.getByCategory
export const getAllNames: EmojisMain['getAllNames'] = emojis.getAllNames

// For CommonJS compatibility, the module itself is the legacy emojis object
module.exports = emojis

// Also export as default for ES modules
module.exports.default = emojis

// Export the type
export default emojis
