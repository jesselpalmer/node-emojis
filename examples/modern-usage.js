/**
 * @fileoverview Modern usage examples for node-emojis v1.0.0
 * @description Demonstrates tree-shaking, ES modules, and performance-optimized imports
 */

console.log('=== node-emojis v1.0.0 - Modern Usage ===\n')

// Method 1: Import everything (backward compatible)
const emojis = require('node-emojis')

console.log('1. Basic emoji access (backward compatible):')
console.log('Fire:', emojis.fire)         // 🔥
console.log('Pizza:', emojis.pizza)       // 🍕
console.log('Unicorn:', emojis.unicorn)   // 🦄

// Method 2: Import only what you need (tree-shaking friendly)
const { search } = require('node-emojis/search')
const { applySkinTone, supportsSkinTone } = require('node-emojis/skin-tones')
const { getAliases, isSameEmoji } = require('node-emojis/aliases')
const { filterByCategory, filterByVersion } = require('node-emojis/filters')

console.log('\n2. Tree-shakeable imports:')

// Search functionality
console.log('\n2a. Search:')
const searchResults = search('happy')
console.log(`Found ${searchResults.length} happy emojis:`)
searchResults.slice(0, 3).forEach(r => 
  console.log(`  ${r.emoji} ${r.name} (score: ${r.score})`)
)

// Skin tone support
console.log('\n2b. Skin tones:')
const wave = '👋'
console.log('Wave:', wave)
console.log('Wave (medium):', applySkinTone(wave, 'medium'))
console.log('Wave (dark):', applySkinTone(wave, '5'))
console.log('Supports skin tone?', supportsSkinTone('wave'))

// Aliases
console.log('\n2c. Aliases:')
console.log('Aliases for "fire":', getAliases('fire'))
console.log('Is "thumbsup" same as "+1"?', isSameEmoji('thumbsup', '+1'))

// Filtering
console.log('\n2d. Filters:')
const animals = filterByCategory('animals')
console.log(`Found ${animals.length} animal emojis`)
console.log('First 3:', animals.slice(0, 3).map(a => `${a.emoji} ${a.name}`).join(', '))

const modernEmojis = filterByVersion('10.0', 'min')
console.log(`\nFound ${modernEmojis.length} emojis from Unicode 10.0+`)

// Method 3: Direct data access (smallest bundle)
const allEmojis = require('node-emojis')
const emojiData = allEmojis.metadata ? Object.keys(allEmojis).filter(k => typeof allEmojis[k] === 'string') : []
const metadata = allEmojis.metadata

console.log('\n3. Direct data access:')
console.log('Total emojis:', emojiData.length)
console.log('Fire metadata:', metadata.fire)

// ES Modules (when using a bundler)
console.log('\n4. ES Module imports (for bundlers):')
console.log(`
// Tree-shakeable imports
import { search } from 'node-emojis/search'
import { applySkinTone } from 'node-emojis/skin-tones'
import { getAliases } from 'node-emojis/aliases'
import { filterByCategory } from 'node-emojis/filters'

// Direct data import (smallest bundle)
import { emojis, metadata } from 'node-emojis'
`)