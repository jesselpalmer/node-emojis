# Getting Started 🚀

This guide will help you get up and running with node-emojis in minutes!

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Import Methods](#import-methods)
- [Common Use Cases](#common-use-cases)
- [TypeScript Setup](#typescript-setup)
- [Next Steps](#next-steps)

## Installation

Install node-emojis using npm, yarn, or pnpm:

```bash
# npm
npm install node-emojis

# yarn
yarn add node-emojis

# pnpm
pnpm add node-emojis
```

## Basic Usage

### CommonJS (Node.js)

```javascript
// Import all emojis (backward compatible)
const emojis = require('node-emojis')

console.log(emojis.fire)        // 🔥
console.log(emojis.smile)       // 😄
console.log(emojis.thumbsup)    // 👍
```

### ES Modules

```javascript
// Import all emojis
import emojis from 'node-emojis'

console.log(emojis.fire)        // 🔥
console.log(emojis.rocket)      // 🚀
```

## Import Methods

### 1. Full Import (Backward Compatible)

```javascript
const emojis = require('node-emojis')

// Access any emoji
console.log(emojis.heart)       // ❤️
console.log(emojis.star)        // ⭐
```

### 2. Tree-Shakeable Imports (Recommended)

Import only the features you need for smaller bundle sizes:

```javascript
// Search functionality
const { search } = require('node-emojis/search')

// Skin tone support
const { applySkinTone } = require('node-emojis/skin-tones')

// Aliases
const { getAliases } = require('node-emojis/aliases')

// Filters
const { filterByCategory } = require('node-emojis/filters')
```

### 3. Category-Specific Imports

Import emojis by category for better organization:

```javascript
// Import specific categories
const animals = require('node-emojis/animals')
const food = require('node-emojis/food')
const people = require('node-emojis/people')

console.log(animals.cat)        // 🐈
console.log(food.pizza)         // 🍕
console.log(people.wave)        // 👋
```

## Common Use Cases

### 1. Display Emojis in Console

```javascript
const emojis = require('node-emojis')

console.log(`Build completed! ${emojis.checkmark_button}`)
console.log(`Warning ${emojis.warning}: Check your configuration`)
console.log(`Error ${emojis.x}: Build failed`)
```

### 2. Search for Emojis

```javascript
const { search } = require('node-emojis/search')

// Search by keyword
const happyEmojis = search('happy')
happyEmojis.forEach(result => {
  console.log(`${result.emoji} - ${result.name}`)
})
```

### 3. Apply Skin Tones

```javascript
const { applySkinTone } = require('node-emojis/skin-tones')
const emojis = require('node-emojis')

const wave = emojis.wave                          // 👋
const waveDark = applySkinTone(wave, 'dark')     // 👋🏿
const waveLight = applySkinTone(wave, 'light')   // 👋🏻
```

### 4. Work with Aliases

```javascript
const emojis = require('node-emojis')

// All these return the same emoji
console.log(emojis.thumbsup)     // 👍
console.log(emojis.thumbs_up)    // 👍
console.log(emojis['+1'])        // 👍
```

### 5. Filter by Category

```javascript
const { filterByCategory } = require('node-emojis/filters')

const foodEmojis = filterByCategory('food')
foodEmojis.forEach(({ name, emoji }) => {
  console.log(`${emoji} :${name}:`)
})
```

## TypeScript Setup

node-emojis includes TypeScript definitions out of the box:

```typescript
import emojis from 'node-emojis'
import { search, SearchResult } from 'node-emojis/search'
import { applySkinTone, SkinTone } from 'node-emojis/skin-tones'

// Full type safety
const fire: string = emojis.fire

// Search with types
const results: SearchResult[] = search('happy')

// Skin tone with type checking
const tone: SkinTone = 'medium-dark'
const waving = applySkinTone(emojis.wave, tone)
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Next Steps

Now that you have node-emojis installed and working:

1. 📖 Check the [API Reference](./API-Reference) for detailed documentation
2. 🍳 Explore [Recipes & Examples](./Recipes-and-Examples) for common patterns
3. 🔍 Learn about [Search Functionality](./API-Reference#search)
4. 🎨 Understand [Skin Tone Support](./API-Reference#skin-tones)
5. 📦 Optimize with [Tree Shaking](./Advanced-Usage#tree-shaking)

## Troubleshooting

### Emojis Not Displaying

If emojis appear as boxes or question marks:
- Ensure your terminal supports Unicode
- Check your system fonts include emoji support
- Try a different terminal emulator

### Module Not Found

If you get module resolution errors:
- Verify node-emojis is installed: `npm list node-emojis`
- Check your Node.js version: `node --version` (requires 20.0.0+)
- Clear npm cache: `npm cache clean --force`

### TypeScript Errors

If TypeScript can't find types:
- Ensure TypeScript 5.0+ is installed
- Check `moduleResolution` in tsconfig.json
- Try restarting your TypeScript server

---

Need help? [Open an issue](https://github.com/jesselpalmer/node-emojis/issues) on GitHub!