/**
 * @fileoverview Basic usage examples for node-emojis
 * @description Demonstrates core functionality including emoji access, search, categories, and skin tones
 */
const emojis = require('node-emojis')

console.log('=== node-emojis examples ===\n')

// 1. Basic emoji access
console.log('1. Basic usage:')
console.log('Fire:', emojis.fire)         // 🔥
console.log('Pizza:', emojis.pizza)       // 🍕
console.log('Unicorn:', emojis.unicorn)   // 🦄

// 2. Modern Unicode 10.0-15.0 emojis
console.log('\n2. Modern emojis:')
console.log('Exploding head:', emojis.exploding_head)  // 🤯
console.log('Pleading face:', emojis.pleading_face)    // 🥺
console.log('Shaking face:', emojis.shaking_face)      // 🫨

// 3. Search functionality
console.log('\n3. Search by keyword:')
const hearts = emojis.searchByKeyword('heart')
console.log(`Found ${hearts.length} heart emojis:`)
hearts.slice(0, 5).forEach(h => console.log(`  ${h.name}: ${h.emoji}`))

// 4. Category access
console.log('\n4. Category imports:')
const animals = require('node-emojis/animals')
console.log('Dog from animals:', animals.dog)  // 🐕
console.log('Cat from animals:', animals.cat)  // 🐈

// 5. Skin tone variations
console.log('\n5. Skin tone support:')
const wave = emojis.wave
console.log('Wave:', wave)                              // 👋
console.log('Wave (medium):', emojis.applySkinTone(wave, 'medium'))    // 👋🏽
console.log('Wave (dark):', emojis.applySkinTone(wave, '5'))          // 👋🏿

// 6. Alias support
console.log('\n6. Emoji aliases:')
console.log('thumbs_up:', emojis.thumbs_up)   // 👍
console.log('thumbsup:', emojis.thumbsup)      // 👍  
console.log('+1:', emojis['+1'])               // 👍
console.log('Same emoji?', emojis.isSameEmoji('thumbs_up', '+1'))  // true

// 7. Reverse mapping
console.log('\n7. Reverse mapping (emoji → name):')
console.log('🔥 →', emojis.emojiToName['🔥'])
console.log('🍕 →', emojis.reverseMapping['🍕'])

// 8. Metadata
console.log('\n8. Emoji metadata:')
const fireMetadata = emojis.metadata.fire
console.log('Fire keywords:', fireMetadata.keywords.join(', '))
console.log('Fire category:', fireMetadata.category)
console.log('Fire Unicode version:', fireMetadata.unicodeVersion)