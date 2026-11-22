[![npm version](https://img.shields.io/npm/v/node-emojis.svg)](https://www.npmjs.com/package/node-emojis)
[![npm downloads](https://img.shields.io/npm/dw/node-emojis.svg)](https://www.npmjs.com/package/node-emojis)
[![CI](https://github.com/jesselpalmer/node-emojis/workflows/CI/badge.svg)](https://github.com/jesselpalmer/node-emojis/actions)
[![bundle size](https://img.shields.io/bundlephobia/min/node-emojis)](https://bundlephobia.com/package/node-emojis)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/node-emojis.svg)](https://github.com/jesselpalmer/node-emojis/blob/master/LICENSE)

# node-emojis 🎉

A modern, tree-shakeable emoji library for Node.js and browsers with TypeScript support.

## ✨ Features

- 🌳 **Tree-shakeable** - Import only what you need
- 📦 **360+ emojis** from Unicode 1.0 to 15.0
- 🔍 **Smart search** with keyword matching
- 🎨 **Skin tone support** for 150+ human emojis
- 🔄 **Emoji aliases** (thumbsup/+1/thumbs_up)
- 📝 **TypeScript** support with full type definitions
- 🚀 **Zero dependencies**
- ⚡ **Optimized** for performance

## 📋 Requirements

- Node.js 20.0.0 or higher
- TypeScript 5.0+ (for TypeScript users)

## 📦 Installation

```bash
npm install node-emojis
```

## 🚀 Quick Start

```javascript
// Import everything (backward compatible)
const emojis = require('node-emojis')
console.log(emojis.fire) // 🔥

// Import only what you need (recommended)
const { search } = require('node-emojis/search')
const { applySkinTone } = require('node-emojis/skin-tones')
```

### ES Modules

```javascript
import emojis from 'node-emojis'
import { search } from 'node-emojis/search'
import { applySkinTone } from 'node-emojis/skin-tones'
```

## 📖 API

### Basic Usage

```javascript
const emojis = require('node-emojis')

// Access emojis directly
emojis.fire        // 🔥
emojis.pizza       // 🍕
emojis.unicorn     // 🦄
emojis['+1']       // 👍 (alias support)
```

### 🔍 Search

```javascript
const { search, getByCategory } = require('node-emojis/search')

// Search by keyword
const results = search('happy')
// Returns: [{ name: 'smile', emoji: '😊', keywords: [...], score: 0.8 }, ...]

// Get all emojis in a category
const animals = getByCategory('animals')
// Returns: [{ name: 'dog', emoji: '🐕', ... }, ...]
```

### 🎨 Skin Tones

```javascript
const { applySkinTone, supportsSkinTone, getAllSkinToneVariations } = require('node-emojis/skin-tones')

// Apply skin tone
applySkinTone('👋', 'medium')     // 👋🏽
applySkinTone('👋', '3')          // 👋🏽 (Fitzpatrick scale)

// Check if emoji supports skin tones
supportsSkinTone('wave')          // true
supportsSkinTone('fire')          // false

// Get all variations
getAllSkinToneVariations('👋')
// { light: '👋🏻', 'medium-light': '👋🏼', medium: '👋🏽', ... }
```

### 🔄 Aliases

```javascript
const { getAliases, getPrimaryName, isSameEmoji } = require('node-emojis/aliases')

// Get aliases
getAliases('fire')                // ['flame', 'hot', 'lit', 'snapstreak']

// Get primary name
getPrimaryName('+1')              // 'thumbs_up'

// Check if two names refer to the same emoji
isSameEmoji('thumbsup', '+1')     // true
```

### 🎯 Filters

```javascript
const { filterByCategory, filterByVersion, filterByKeyword } = require('node-emojis/filters')

// Filter by category
const foods = filterByCategory('food')

// Filter by Unicode version
const modernEmojis = filterByVersion('10.0', 'min')  // Unicode 10.0+
const oldEmojis = filterByVersion('1.0', 'exact')    // Only Unicode 1.0

// Filter by keyword
const hearts = filterByKeyword('heart')
```

### 🔧 Utilities

```javascript
const { getNameFromEmoji, isValidEmoji, isValidEmojiName } = require('node-emojis')

// Reverse lookup
getNameFromEmoji('🔥')            // 'fire'

// Validation
isValidEmoji('🔥')                // true
isValidEmojiName('fire')          // true
```

## 🌲 Tree Shaking

Import only what you need to minimize bundle size:

```javascript
// ❌ Imports entire library
import emojis from 'node-emojis'

// ✅ Imports only search functionality
import { search } from 'node-emojis/search'

// ✅ Import multiple features
import { search } from 'node-emojis/search'
import { applySkinTone } from 'node-emojis/skin-tones'
import { getAliases } from 'node-emojis/aliases'
```

## 📊 Bundle Size Comparison

| Import Style | Size (minified) |
| ------------ | --------------- |
| Full library | ~85KB |
| Search only | ~15KB |
| Skin tones only | ~8KB |
| Aliases only | ~6KB |
| Direct data import | ~60KB |

## 📚 Documentation

For comprehensive documentation, examples, and guides:

- **[Complete Documentation](./docs/)** - All guides and references
- **[Getting Started](https://github.com/jesselpalmer/node-emojis/wiki/Getting-Started)** - Installation and basic usage
- **[API Reference](https://github.com/jesselpalmer/node-emojis/wiki/API-Reference)** - Complete API documentation
- **[FAQ](https://github.com/jesselpalmer/node-emojis/wiki/FAQ)** - Frequently asked questions
- **[Migration Guide](https://github.com/jesselpalmer/node-emojis/wiki/Migration-Guide)** - Upgrading from v0.x
- **[GitHub Wiki](https://github.com/jesselpalmer/node-emojis/wiki)** - Online documentation

## 🎯 Examples

See the [examples](./examples) directory for more usage examples:

- [Basic usage](./examples/basic-usage.js) - CommonJS examples
- [Modern usage](./examples/modern-usage.js) - Tree-shaking examples

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## 📄 License

MIT © Jesse Palmer

## 🙏 Acknowledgments

Emoji data sourced from Unicode.org and Emojipedia.
