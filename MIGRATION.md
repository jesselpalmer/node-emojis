# Migration Guide: v0.x to v1.0

## 🎉 What's New in v1.0

- **Tree-shakeable imports** - Import only the features you need
- **Modern project structure** - Organized into features, utils, and data
- **JSON-based data** - Smaller bundle sizes and better performance
- **Full TypeScript support** - Complete type definitions
- **New features** - Filters, validators, and more utilities
- **Node.js 20+ requirement** - Updated minimum Node.js version for better ES module support

## ✅ Backward Compatibility

Good news! v1.0 maintains full backward compatibility with v0.x. Your existing code will continue to work without any changes.

```javascript
// This still works in v1.0
const emojis = require('node-emojis')
console.log(emojis.fire) // 🔥
```

## 🚀 New Import Options

While your old code continues to work, v1.0 offers new ways to import that can significantly reduce your bundle size:

### Tree-Shakeable Imports (Recommended)

```javascript
// Old way - imports everything
const emojis = require('node-emojis')

// New way - import only what you need (consolidated)
const { search } = require('node-emojis/search')
const { applySkinTone, supportsSkinTone } = require('node-emojis/skin-tones')
const { getAliases, getPrimaryName } = require('node-emojis/aliases')
const { 
  isValidEmoji, 
  isValidEmojiName, 
  getNameFromEmoji 
} = require('node-emojis')
```

### ES Module Imports

```javascript
// ES modules with tree-shaking (consolidated)
import { search } from 'node-emojis/search'
import { applySkinTone, supportsSkinTone } from 'node-emojis/skin-tones'
import { getAliases, getPrimaryName } from 'node-emojis/aliases'
import { 
  isValidEmoji, 
  isValidEmojiName, 
  getNameFromEmoji 
} from 'node-emojis'
```

## 📦 Bundle Size Improvements

By using tree-shakeable imports, you can reduce your bundle size:

| Import Style | Bundle Size |
|-------------|------------|
| `require('node-emojis')` | ~85KB |
| `require('node-emojis/search')` | ~15KB |
| `require('node-emojis/skin-tones')` | ~8KB |

## 🔄 API Changes

### Search Function

The search function now returns more detailed results:

```javascript
// v0.x
emojis.searchByKeyword('happy')
// Returns: [{ emoji: '😊', name: 'happy' }, ...]

// v1.0
const { search } = require('node-emojis/search')
search('happy')
// Returns: [{ emoji: '😊', name: 'happy', keywords: [...], category: 'people', score: 0.9 }, ...]
```

### New Features

v1.0 adds several new features that weren't available in v0.x:

```javascript
// Consolidated imports for better readability
const { filterByCategory, filterByVersion } = require('node-emojis/filters')
const { 
  isValidEmoji, 
  isValidEmojiName, 
  getNameFromEmoji 
} = require('node-emojis')

// Usage examples
const animals = filterByCategory('animals')
const modernEmojis = filterByVersion('10.0', 'min')
isValidEmoji('🔥') // true
isValidEmojiName('fire') // true
getNameFromEmoji('🔥') // 'fire'
```

## 🏗️ Project Structure Changes

The internal structure has been reorganized, but this doesn't affect the public API:

```text
v0.x structure:
├── src/
│   ├── index.ts
│   ├── emojis/
│   ├── metadata/
│   └── (many files in root)

v1.0 structure:
├── src/
│   ├── index.ts
│   ├── core/        # Core types and interfaces
│   ├── data/        # JSON data files
│   ├── features/    # Feature modules (search, skin-tones, etc.)
│   ├── utils/       # Utility functions
│   └── types/       # TypeScript types
```

## 💡 Recommendations

1. **For new projects**: Use tree-shakeable imports from the start
2. **For existing projects**: No changes needed, but consider migrating to tree-shakeable imports to reduce bundle size
3. **For TypeScript users**: Take advantage of the improved type definitions

## 🤝 Need Help?

If you encounter any issues during migration, please [open an issue](https://github.com/jesselpalmer/node-emojis/issues) on GitHub.
