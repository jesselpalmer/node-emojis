# Frequently Asked Questions (FAQ) ❓

## Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Usage Questions](#usage-questions)
- [Performance & Optimization](#performance--optimization)
- [Compatibility](#compatibility)
- [Troubleshooting](#troubleshooting)

---

## General Questions

### What is node-emojis?

node-emojis is a modern, tree-shakeable emoji library for Node.js that provides:

- 360+ Unicode emojis (v1.0 to v15.0)
- TypeScript support with full type definitions
- Smart search functionality
- Skin tone support
- Emoji aliases
- Zero runtime dependencies

### How is node-emojis different from other emoji libraries?

Key differences:

- **Tree-shakeable**: Import only what you need, reducing bundle size
- **Zero dependencies**: No external runtime dependencies
- **TypeScript-first**: Written in TypeScript with comprehensive types
- **Modern exports**: Supports both CommonJS and ES modules
- **Category imports**: Import emojis by category
- **Comprehensive features**: Search, skin tones, aliases, and filters

### Is node-emojis suitable for production use?

Yes! node-emojis is production-ready with:

- 85%+ test coverage
- Semantic versioning
- Security policy
- Active maintenance
- Used by many projects in production

---

## Installation & Setup

### What are the system requirements?

- Node.js 20.0.0 or higher
- TypeScript 5.0+ (for TypeScript users)
- npm, yarn, or pnpm package manager

### Why does node-emojis require Node.js 20+?

Node.js 20+ provides:

- Better ES module support
- Improved performance
- Enhanced TypeScript integration
- Long-term support (LTS)

### Can I use node-emojis in the browser?

While node-emojis is designed for Node.js, it can work in browsers with a bundler like webpack, Rollup, or Vite. The tree-shakeable design helps minimize bundle size.

### How do I install specific versions?

```bash
# Install latest
npm install node-emojis

# Install specific version
npm install node-emojis@1.0.0

# Install from GitHub
npm install jesselpalmer/node-emojis
```

---

## Usage Questions

### How do I access emojis with special characters in their names?

Use bracket notation for names with special characters:

```javascript
const emojis = require('node-emojis')

// Names with special characters
console.log(emojis['+1'])        // 👍
console.log(emojis['1st_place'])  // 🥇
console.log(emojis['100'])        // 💯
```

### How do I find all aliases for an emoji?

Use the aliases module:

```javascript
const { getAliases, getAllNames } = require('node-emojis/aliases')

// Get aliases only
const aliases = getAliases('smile')  // ['happy', 'joy', 'pleased']

// Get all names (primary + aliases)
const allNames = getAllNames('smile') // ['smile', 'happy', 'joy', 'pleased']
```

### Can I add custom emojis?

node-emojis doesn't support custom emojis as it strictly follows Unicode standards. For custom emoji needs, consider:

- Creating a wrapper module
- Extending the emoji object
- Using a custom emoji solution alongside node-emojis

### How do I handle emojis in user input?

Use the validator functions:

```javascript
const { isValidEmoji, sanitizeEmojiName } = require('node-emojis')

// Validate emoji characters
if (isValidEmoji(userInput)) {
  // Process valid emoji
}

// Sanitize emoji names
const safeName = sanitizeEmojiName(userInput)
```

---

## Performance & Optimization

### How can I reduce bundle size?

Use tree-shakeable imports:

```javascript
// ❌ Don't import everything
const emojis = require('node-emojis')

// ✅ Import only what you need
const { search } = require('node-emojis/search')
const { applySkinTone } = require('node-emojis/skin-tones')

// ✅ Import specific categories
const animals = require('node-emojis/animals')
```

### Is searching performant with large datasets?

Yes! The search module is optimized with:

- Indexed keywords for fast lookups
- Relevance scoring
- Memoization for repeated searches
- Efficient string matching algorithms

### Does node-emojis cache data?

The library uses several caching strategies:

- Lazy loading for categories
- Memoized search results
- Frozen objects to prevent mutations
- Singleton pattern for data structures

---

## Compatibility

### Does node-emojis work with React/Vue/Angular?

Yes! node-emojis works with any JavaScript framework:

```jsx
// React example
import emojis from 'node-emojis'

function EmojiButton() {
  return <button>{emojis.heart} Like</button>
}
```

### Can I use it with Next.js/Nuxt/SvelteKit?

Yes, node-emojis is SSR-friendly and works with:

- Next.js (pages and app router)
- Nuxt 3
- SvelteKit
- Any SSR framework

### Is it compatible with Deno/Bun?

- **Bun**: Yes, fully compatible
- **Deno**: Works with npm specifiers or CDN imports

---

## Troubleshooting

### Why do some emojis show as boxes/question marks?

This is usually a font/terminal issue:

1. Ensure your terminal supports Unicode
2. Install fonts with emoji support
3. Try a different terminal (e.g., Windows Terminal, iTerm2)
4. Check system emoji font settings

### Why can't TypeScript find the types?

Check your tsconfig.json:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Module not found errors

Common solutions:

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear npm cache: `npm cache clean --force`
3. Check Node.js version: `node --version`
4. Verify installation: `npm list node-emojis`

### Search returns empty results

Ensure you're using the search correctly:

```javascript
const { search } = require('node-emojis/search')

// ✅ Correct
const results = search('happy')

// ❌ Common mistakes
const results = search('😊')  // Don't search with emoji characters
const results = search('')     // Empty string returns no results
```

### Skin tones not working

Check if the emoji supports skin tones:

```javascript
const { supportsSkinTone, applySkinTone } = require('node-emojis/skin-tones')

if (supportsSkinTone('wave')) {
  const waving = applySkinTone('👋', 'dark')
}
```

---

## Still need help?

If your question isn't answered here:

1. 📖 Check the [API Reference](./API-Reference)
2. 💬 [Open a discussion](https://github.com/jesselpalmer/node-emojis/discussions)
3. 🐛 [Report an issue](https://github.com/jesselpalmer/node-emojis/issues)
4. 🔍 Search [existing issues](https://github.com/jesselpalmer/node-emojis/issues?q=is%3Aissue)

---

Last updated: July 2025 | Version: 1.0.0
