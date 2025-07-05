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

// Create the default export with backward compatibility
const emojis: EmojisMain = createBackwardCompatibleAPI()

// For CommonJS compatibility, we need to export emojis as the module
module.exports = emojis

// Also export as default for ES modules
module.exports.default = emojis

// Export the type
export default emojis

// Re-export features for tree-shaking (these are already exported via __exportStar)
// The named data exports are already available via getters on the emojis object
