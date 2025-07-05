# Migration Guide 🚀

This guide helps you migrate from node-emojis v0.x to v1.0 and from other emoji libraries.

## Table of Contents

- [Migrating from v0.x to v1.0](#migrating-from-v0x-to-v10)
- [Migrating from Other Libraries](#migrating-from-other-libraries)
- [Breaking Changes](#breaking-changes)
- [Migration Examples](#migration-examples)
- [Step-by-Step Migration](#step-by-step-migration)

---

## Migrating from v0.x to v1.0

### Overview of Changes

node-emojis v1.0 is a complete rewrite with significant improvements:

- ✅ **Tree-shakeable imports** for smaller bundles
- ✅ **TypeScript-first** with comprehensive types
- ✅ **Zero dependencies** for better security
- ✅ **Modern exports** supporting both CommonJS and ES modules
- ✅ **Enhanced search** with relevance scoring
- ✅ **Category imports** for better organization
- ✅ **Skin tone support** for 150+ human emojis

### Quick Migration Checklist

- [ ] Update Node.js to 20.0.0+
- [ ] Update TypeScript to 5.0+ (if using TypeScript)
- [ ] Install node-emojis v1.0: `npm install node-emojis@latest`
- [ ] Update import statements
- [ ] Update emoji access patterns
- [ ] Test tree-shakeable imports
- [ ] Update TypeScript types (if applicable)

---

## Breaking Changes

### 1. Node.js Version Requirement

**v0.x**: Node.js 12+
**v1.0**: Node.js 20.0.0+

```bash
# Check your Node.js version
node --version

# Upgrade if needed (using nvm)
nvm install 20
nvm use 20
```

### 2. Import Structure Changes

**v0.x**:

```javascript
// Old way (still works in v1.0)
const emoji = require('node-emojis')
console.log(emoji.get('fire'))  // 🔥
```

**v1.0** (recommended):

```javascript
// New way - direct access
const emojis = require('node-emojis')
console.log(emojis.fire)  // 🔥

// Tree-shakeable imports
const { search } = require('node-emojis/search')

// Validator functions now from main export
const { isValidEmoji, sanitizeEmojiName, isValidEmojiName } = require('node-emojis')
```

### 3. API Method Changes

**v0.x**:

```javascript
const emoji = require('node-emojis')

// Old methods (removed)
emoji.get('fire')          // ❌ Removed
emoji.find('happy')        // ❌ Removed  
emoji.random()            // ❌ Removed
emoji.all()               // ❌ Removed
```

**v1.0**:

```javascript
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

// New methods
emojis.fire                // ✅ Direct access
search('happy')            // ✅ Enhanced search
```

### 4. Search Functionality

**v0.x**:

```javascript
const emoji = require('node-emojis')

// Old search (basic)
const results = emoji.find('happy')
// Returns: ['😊', '😄', '😁']
```

**v1.0**:

```javascript
const { search } = require('node-emojis/search')

// New search (enhanced)
const results = search('happy')
// Returns: [
//   { name: 'smile', emoji: '😊', keywords: ['happy', 'joy'], category: 'people', score: 0.95 },
//   { name: 'grinning', emoji: '😄', keywords: ['happy', 'joy'], category: 'people', score: 0.90 }
// ]
```

---

## Migration Examples

### Basic Emoji Access

**Before (v0.x)**:

```javascript
const emoji = require('node-emojis')

console.log(emoji.get('fire'))     // 🔥
console.log(emoji.get('heart'))    // ❤️
console.log(emoji.get(':smile:'))  // 😄
```

**After (v1.0)**:

```javascript
const emojis = require('node-emojis')

console.log(emojis.fire)    // 🔥
console.log(emojis.heart)   // ❤️  
console.log(emojis.smile)   // 😄
```

### Search Migration

**Before (v0.x)**:

```javascript
const emoji = require('node-emojis')

const results = emoji.find('cat')
// Simple array of emoji characters
```

**After (v1.0)**:

```javascript
const { search } = require('node-emojis/search')

const results = search('cat')
// Rich objects with metadata
results.forEach(({ name, emoji, category, keywords }) => {
  console.log(`${emoji} :${name}: (${category})`)
})
```

### TypeScript Migration

**Before (v0.x)**:

```typescript
import * as emoji from 'node-emojis'

// Limited type support
const fire: string = emoji.get('fire')
```

**After (v1.0)**:

```typescript
import emojis from 'node-emojis'
import { search, SearchResult } from 'node-emojis/search'
import { applySkinTone, SkinTone } from 'node-emojis/skin-tones'

// Full type safety
const fire: string = emojis.fire
const results: SearchResult[] = search('happy')
const tone: SkinTone = 'medium-dark'
```

---

## Migrating from Other Libraries

### From `node-emoji`

**node-emoji**:

```javascript
const emoji = require('node-emoji')

emoji.get('coffee')           // ☕
emoji.find('heart')           // Multiple hearts
emoji.search('smile')         // Array of objects
emoji.random()                // Random emoji
emoji.emojify(':coffee:')     // ☕
```

**node-emojis v1.0**:

```javascript
const emojis = require('node-emojis')
const { search, getByCategory } = require('node-emojis/search')

emojis.coffee                 // ☕
search('heart')               // Enhanced search results
search('smile')               // Rich search results with scoring
// No random() - implement your own
emojis.coffee                 // Direct access (no colons needed)
```

### From `emoji-js`

**emoji-js**:

```javascript
const EmojiConvertor = require('emoji-js')
const emoji = new EmojiConvertor()

emoji.replace_colons(':smile:')     // 😄
emoji.replace_unified('1F604')      // 😄
```

**node-emojis v1.0**:

```javascript
const emojis = require('node-emojis')

emojis.smile                        // 😄  
// No direct Unicode support - use emoji directly
```

### From `twemoji`

**twemoji**:

```javascript
const twemoji = require('twemoji')

twemoji.parse('I ❤️ emoji!')  // HTML with images
```

**node-emojis v1.0**:

```javascript
const emojis = require('node-emojis')

// node-emojis focuses on Unicode emojis, not image conversion
// For image conversion, continue using twemoji alongside node-emojis
const text = `I ${emojis.heart} emoji!`
```

---

## New Features in v1.0

### 1. Tree-Shakeable Imports

Reduce bundle size by importing only what you need:

```javascript
// Import specific features
const { search } = require('node-emojis/search')
const { applySkinTone } = require('node-emojis/skin-tones')
const { getAliases } = require('node-emojis/aliases')

// Import specific categories
const animals = require('node-emojis/animals')
const food = require('node-emojis/food')
```

### 2. Skin Tone Support

Apply skin tones to compatible emojis:

```javascript
const { applySkinTone, supportsSkinTone } = require('node-emojis/skin-tones')
const emojis = require('node-emojis')

if (supportsSkinTone('wave')) {
  const waveDark = applySkinTone(emojis.wave, 'dark')     // 👋🏿
  const waveLight = applySkinTone(emojis.wave, 'light')   // 👋🏻
}
```

### 3. Enhanced Search

Get rich search results with relevance scoring:

```javascript
const { search } = require('node-emojis/search')

const results = search('love')
// Returns objects with emoji, name, keywords, category, and score
```

### 4. Emoji Aliases

Work with multiple names for the same emoji:

```javascript
const emojis = require('node-emojis')
const { getAliases } = require('node-emojis/aliases')

console.log(emojis.thumbsup)    // 👍
console.log(emojis.thumbs_up)   // 👍 (alias)
console.log(emojis['+1'])       // 👍 (alias)

const aliases = getAliases('thumbsup')  // ['thumbs_up', '+1']
```

### 5. Category Organization

Access emojis by category:

```javascript
const { getByCategory, getCategories } = require('node-emojis/search')

const animals = getByCategory('animals')
const categories = getCategories()  // All available categories
```

---

## Step-by-Step Migration

### Step 1: Environment Setup

```bash
# 1. Check Node.js version
node --version  # Should be 20.0.0+

# 2. Update if needed
nvm install 20
nvm use 20

# 3. Update package.json
npm install node-emojis@latest
```

### Step 2: Update Imports

Create a migration script to help with the transition:

```javascript
// migration-helper.js
const fs = require('fs')
const path = require('path')

// Replace old patterns with new ones
const replacements = [
  { from: /emoji\.get\('([^']+)'\)/g, to: 'emojis.$1' },
  { from: /emoji\.find\(/g, to: 'search(' },
  { from: /require\('node-emojis'\)/g, to: 'require(\'node-emojis\')' }
]

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to)
  })
  
  fs.writeFileSync(filePath, content)
  console.log(`Migrated: ${filePath}`)
}

// Use this helper to migrate your files
```

### Step 3: Update Code Patterns

**Old pattern**:

```javascript
const emoji = require('node-emojis')

function logSuccess(message) {
  console.log(emoji.get('checkmark') + ' ' + message)
}

function searchEmojis(term) {
  return emoji.find(term)
}
```

**New pattern**:

```javascript
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

function logSuccess(message) {
  console.log(emojis.white_check_mark + ' ' + message)
}

function searchEmojis(term) {
  return search(term)
}
```

### Step 4: Test and Validate

```javascript
// test-migration.js
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

// Test basic functionality
console.assert(emojis.fire === '🔥', 'Fire emoji should work')
console.assert(emojis.heart === '❤️', 'Heart emoji should work')

// Test search
const results = search('happy')
console.assert(Array.isArray(results), 'Search should return array')
console.assert(results.length > 0, 'Search should find results')
console.assert(results[0].emoji, 'Results should have emoji property')

console.log('✅ Migration validation passed!')
```

### Step 5: Optimize with Tree-Shaking

After migration, optimize your imports:

```javascript
// Before optimization
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

// After optimization - only import what you need
const { search } = require('node-emojis/search')  // Only search
const animals = require('node-emojis/animals')     // Only animal emojis
```

---

## Troubleshooting Migration

### Common Issues

**Issue**: `Cannot find module 'node-emojis'`
**Solution**: Ensure you've installed v1.0: `npm install node-emojis@latest`

**Issue**: TypeScript errors after migration
**Solution**: Update TypeScript to 5.0+ and check tsconfig.json settings

**Issue**: Emoji names have changed
**Solution**: Check our [alias documentation](./API-Reference#aliases-module) for alternative names

**Issue**: Bundle size increased
**Solution**: Use tree-shakeable imports to reduce bundle size

### Getting Help

If you encounter issues during migration:

1. 📖 Check this guide and the [API Reference](./API-Reference)
2. 🔍 Search [existing issues](https://github.com/jesselpalmer/node-emojis/issues)
3. 💬 Start a [discussion](https://github.com/jesselpalmer/node-emojis/discussions)
4. 🐛 [Open an issue](https://github.com/jesselpalmer/node-emojis/issues/new) if you find bugs

---

**Need help with migration?** We're here to help! Open a [discussion](https://github.com/jesselpalmer/node-emojis/discussions) with details about your use case.

---

Last updated: July 2025 | Version: 1.0.0
