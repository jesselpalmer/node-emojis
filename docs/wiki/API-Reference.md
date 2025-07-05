# API Reference 📚

Complete API documentation for all node-emojis modules and functions.

## Table of Contents

- [Core Module](#core-module)
- [Search Module](#search-module)
- [Skin Tones Module](#skin-tones-module)
- [Aliases Module](#aliases-module)
- [Filters Module](#filters-module)
- [Validators Module](#validators-module)
- [Reverse Mapping Module](#reverse-mapping-module)

---

## Core Module

The main module provides direct access to all emojis.

### Import

```javascript
// CommonJS
const emojis = require('node-emojis')

// ES Modules
import emojis from 'node-emojis'
```

### Properties

- `emojis[name]` - Access any emoji by name
- `emojis.categories` - Object containing emojis organized by category
- `emojis.metadata` - Metadata for all emojis
- `emojis.emojiToName` - Reverse mapping from emoji to name

### Example

```javascript
console.log(emojis.fire)          // 🔥
console.log(emojis.categories.people.smile)  // 😄
```

---

## Search Module

Provides powerful search functionality with keyword matching.

### Import

```javascript
const { search, getByCategory, getCategories } = require('node-emojis/search')
```

### Functions

#### `search(keyword: string): SearchResult[]`

Search for emojis by keyword, name, or alias.

**Parameters:**
- `keyword` - The search term (case-insensitive)

**Returns:**
- Array of `SearchResult` objects sorted by relevance

**SearchResult Type:**
```typescript
interface SearchResult {
  name: string      // Canonical emoji name
  emoji: string     // The emoji character
  keywords: string[] // Associated keywords
  category: string  // Category name
  score?: number    // Relevance score (0-1)
}
```

**Example:**
```javascript
const results = search('happy')
// Returns emojis with 'happy' in name, keywords, or aliases
```

#### `getByCategory(category: string): SearchResult[]`

Get all emojis in a specific category.

**Parameters:**
- `category` - Category name (e.g., 'people', 'animals', 'food')

**Returns:**
- Array of emojis in the category

**Example:**
```javascript
const animals = getByCategory('animals')
// Returns all animal emojis
```

#### `getCategories(): string[]`

Get all available category names.

**Returns:**
- Sorted array of category names

**Example:**
```javascript
const categories = getCategories()
// Returns: ['animals', 'food', 'nature', 'people', 'travel', ...]
```

---

## Skin Tones Module

Support for skin tone modifiers on compatible emojis.

### Import

```javascript
const { 
  applySkinTone, 
  supportsSkinTone, 
  getAllSkinToneVariations, 
  removeSkinTone,
  SKIN_TONE_MODIFIERS 
} = require('node-emojis/skin-tones')
```

### Types

```typescript
type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'
type SkinToneAlias = '1' | '2' | '3' | '4' | '5'
```

### Functions

#### `applySkinTone(emoji: string, tone: SkinTone | SkinToneAlias): string`

Apply a skin tone modifier to an emoji.

**Parameters:**
- `emoji` - The emoji character
- `tone` - Skin tone name or numeric alias (1-5)

**Returns:**
- Emoji with skin tone applied

**Example:**
```javascript
applySkinTone('👋', 'dark')        // 👋🏿
applySkinTone('👋', '3')           // 👋🏽 (medium)
```

#### `supportsSkinTone(nameOrEmoji: string): boolean`

Check if an emoji supports skin tone modifiers.

**Parameters:**
- `nameOrEmoji` - Emoji name or character

**Returns:**
- `true` if skin tones are supported

**Example:**
```javascript
supportsSkinTone('wave')           // true
supportsSkinTone('🔥')             // false
```

#### `getAllSkinToneVariations(emoji: string): Record<SkinTone | 'default', string>`

Get all skin tone variations of an emoji.

**Returns:**
- Object with all variations including default

**Example:**
```javascript
getAllSkinToneVariations('👋')
// Returns: {
//   default: '👋',
//   light: '👋🏻',
//   'medium-light': '👋🏼',
//   medium: '👋🏽',
//   'medium-dark': '👋🏾',
//   dark: '👋🏿'
// }
```

#### `removeSkinTone(emoji: string): string`

Remove skin tone modifiers from an emoji.

**Example:**
```javascript
removeSkinTone('👋🏿')             // 👋
```

---

## Aliases Module

Manage emoji aliases and alternative names.

### Import

```javascript
const { 
  aliases, 
  getAliases, 
  getPrimaryName, 
  isSameEmoji,
  getAllNames,
  resolveEmoji,
  getAliasMap
} = require('node-emojis/aliases')
```

### Functions

#### `getAliases(name: string): string[]`

Get all aliases for an emoji.

**Returns:**
- Array of aliases (excluding the input name)

**Example:**
```javascript
getAliases('smile')                // ['happy', 'joy', 'pleased']
getAliases('happy')                // ['smile', 'joy', 'pleased']
```

#### `getPrimaryName(name: string): string`

Get the primary name for an emoji (resolves aliases).

**Example:**
```javascript
getPrimaryName('happy')            // 'smile'
getPrimaryName('smile')            // 'smile'
```

#### `isSameEmoji(name1: string, name2: string): boolean`

Check if two names refer to the same emoji.

**Example:**
```javascript
isSameEmoji('smile', 'happy')      // true
isSameEmoji('smile', 'fire')       // false
```

#### `getAllNames(name: string): string[]`

Get all names (primary + aliases) for an emoji.

**Example:**
```javascript
getAllNames('smile')               // ['smile', 'happy', 'joy', 'pleased']
```

#### `resolveEmoji(nameOrAlias: string): string | undefined`

Get emoji character from name or alias.

**Example:**
```javascript
resolveEmoji('fire')               // '🔥'
resolveEmoji('flame')              // '🔥' (via alias)
```

---

## Filters Module

Filter emojis by various criteria.

### Import

```javascript
const { 
  filterByCategory, 
  filterByVersion, 
  filterByKeyword 
} = require('node-emojis/filters')
```

### Functions

#### `filterByCategory(category: string): Array<{name: string, emoji: string}>`

Filter emojis by category.

**Example:**
```javascript
const animals = filterByCategory('animals')
// Returns all animal emojis
```

#### `filterByVersion(version: string, comparison?: 'min' | 'max' | 'exact'): Array<{name: string, emoji: string}>`

Filter emojis by Unicode version.

**Parameters:**
- `version` - Unicode version (e.g., '12.0')
- `comparison` - How to compare versions (default: 'min')

**Example:**
```javascript
filterByVersion('12.0', 'min')     // Emojis from Unicode 12.0+
filterByVersion('1.0', 'exact')    // Only Unicode 1.0 emojis
```

#### `filterByKeyword(keyword: string): Array<{name: string, emoji: string}>`

Filter emojis containing a keyword.

**Example:**
```javascript
filterByKeyword('heart')           // All emojis with 'heart' in keywords
```

---

## Validators Module

Validation utilities for emojis and emoji names.

### Import

```javascript
const { 
  isValidEmoji,
  isValidEmojiName,
  hasVariationSelector,
  stripVariationSelectors,
  isValidSkinTone,
  sanitizeEmojiName
} = require('node-emojis')
```

### Functions

#### `isValidEmoji(str: string): boolean`

Check if a string is a valid emoji.

**Example:**
```javascript
isValidEmoji('🔥')                 // true
isValidEmoji('hello')              // false
isValidEmoji('👋🏻')               // true
```

#### `isValidEmojiName(name: string): boolean`

Check if a string is a valid emoji name.

**Example:**
```javascript
isValidEmojiName('fire')           // true
isValidEmojiName('hello world')    // false (spaces not allowed)
isValidEmojiName('thumbs-up')      // true (hyphens allowed)
```

#### `hasVariationSelector(emoji: string): boolean`

Check if an emoji contains variation selectors.

**Example:**
```javascript
hasVariationSelector('☀️')         // true
hasVariationSelector('🔥')         // false
```

#### `stripVariationSelectors(emoji: string): string`

Remove variation selectors from emoji.

**Example:**
```javascript
stripVariationSelectors('☀️')      // '☀'
```

#### `sanitizeEmojiName(name: string): string`

Convert a string to a valid emoji name format.

**Example:**
```javascript
sanitizeEmojiName('Hello World!')   // 'hello_world_'
sanitizeEmojiName('thumbs up')      // 'thumbs_up'
```

---

## Reverse Mapping Module

Map emojis back to their names.

### Import

```javascript
const { 
  getNameFromEmoji,
  isKnownEmoji,
  getReverseMapping,
  createReverseMapping
} = require('node-emojis')
```

### Functions

#### `getNameFromEmoji(emoji: string): string | undefined`

Get the name of an emoji from its character.

**Example:**
```javascript
getNameFromEmoji('🔥')             // 'fire'
getNameFromEmoji('👋')             // 'wave'
getNameFromEmoji('❓')             // undefined (if not in database)
```

#### `isKnownEmoji(emoji: string): boolean`

Check if an emoji is in the database.

**Example:**
```javascript
isKnownEmoji('🔥')                 // true
isKnownEmoji('🦖')                 // true/false depending on version
```

#### `getReverseMapping(): Record<string, string>`

Get the complete reverse mapping object.

**Returns:**
- Frozen object mapping emojis to names

**Example:**
```javascript
const mapping = getReverseMapping()
console.log(mapping['🔥'])         // 'fire'
```

---

## Type Definitions

All modules include TypeScript definitions. Key types include:

```typescript
interface SearchResult {
  name: string
  emoji: string
  keywords: string[]
  category: string
  score?: number
}

interface EmojiMetadata {
  emoji: string
  name: string
  category: string
  keywords: string[]
  unicodeVersion: string
}

type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'
```

---

Need more details? Check our [examples](./Recipes-and-Examples) or [open an issue](https://github.com/jesselpalmer/node-emojis/issues)!