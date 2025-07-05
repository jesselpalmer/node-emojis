// Core data
import emojiData from './data/emojis.json'
import metadataData from './data/metadata.json'
import categoriesData from './data/categories.json'

// Features - re-export everything
export * from './features/search'
export * from './features/skin-tones'
export * from './features/aliases'
export * from './features/filters'

// Utils
export * from './utils/reverse-mapping'
export * from './utils/validators'

// Types
export * from './core/emoji'

// Define the type for the main emojis object
interface EmojisMain {
  [emojiName: string]: string | any
  metadata: any
  categories: any
  emojiToName: Record<string, string>
  reverseMapping: Record<string, string>
  searchByKeyword: (keyword: string) => any[]
  getByCategory: (category: string) => any[]
  getAllNames: () => string[]
  applySkinTone: (emoji: string, tone: any) => string
  supportsSkinTone: (nameOrEmoji: string) => boolean
  getAllSkinToneVariations: (emoji: string) => any
  removeSkinTone: (emoji: string) => string
  aliases: any
  getAliases: (name: string) => string[]
  getPrimaryName: (name: string) => string
  isSameEmoji: (name1: string, name2: string) => boolean
  getAllNamesForEmoji: (name: string) => string[]
  skinTones: any
  skinToneModifiers: any
  SKIN_TONE_MODIFIERS: any
  SKIN_TONES: any
}

// Create default export with backward compatibility
const emojis: EmojisMain = {} as EmojisMain

// Copy all emoji properties
Object.assign(emojis, emojiData)

// Add getters for backward compatibility
Object.defineProperty(emojis, 'metadata', {
  get: () => metadataData,
  enumerable: false
})

Object.defineProperty(emojis, 'categories', {
  get: () => {
    // Convert categories from arrays of names to objects of emojis
    const categoryObjects: any = {}
    Object.entries(categoriesData).forEach(([category, names]) => {
      categoryObjects[category] = {}
      names.forEach((name: string) => {
        if (emojiData[name as keyof typeof emojiData]) {
          categoryObjects[category][name] = emojiData[name as keyof typeof emojiData]
        }
      })
    })
    return categoryObjects
  },
  enumerable: false
})

// For backward compatibility - add reverse mapping
let cachedReverseMapping: Record<string, string> | null = null
Object.defineProperty(emojis, 'emojiToName', {
  get: () => {
    if (!cachedReverseMapping) {
      cachedReverseMapping = {}
      Object.entries(emojiData).forEach(([name, emoji]) => {
        cachedReverseMapping![emoji as string] = name
      })
    }
    return cachedReverseMapping
  },
  enumerable: false
})

Object.defineProperty(emojis, 'reverseMapping', {
  get: () => emojis.emojiToName,
  enumerable: false
})

// Add backward compatibility methods
Object.defineProperty(emojis, 'searchByKeyword', {
  value: (keyword: string) => {
    const { search } = require('./features/search')
    // Transform results for backward compatibility
    return search(keyword).map((result: any) => ({
      name: result.name,
      emoji: result.emoji,
      metadata: {
        keywords: result.keywords,
        category: result.category,
        unicodeVersion: metadataData[result.name as keyof typeof metadataData]?.unicodeVersion || '1.0'
      }
    }))
  },
  enumerable: false
})

Object.defineProperty(emojis, 'getByCategory', {
  value: (category: string) => {
    const { getByCategory } = require('./features/search')
    // Transform results for backward compatibility
    return getByCategory(category).map((result: any) => ({
      name: result.name,
      emoji: result.emoji,
      metadata: {
        keywords: result.keywords,
        category: result.category,
        unicodeVersion: metadataData[result.name as keyof typeof metadataData]?.unicodeVersion || '1.0'
      }
    }))
  },
  enumerable: false
})

Object.defineProperty(emojis, 'getAllNames', {
  value: () => Object.keys(emojiData),
  enumerable: false
})

// Skin tone methods
Object.defineProperty(emojis, 'applySkinTone', {
  value: (emoji: string, tone: any) => {
    const { applySkinTone } = require('./features/skin-tones')
    return applySkinTone(emoji, tone)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'supportsSkinTone', {
  value: (nameOrEmoji: string) => {
    const { supportsSkinTone } = require('./features/skin-tones')
    return supportsSkinTone(nameOrEmoji)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'getAllSkinToneVariations', {
  value: (emoji: string) => {
    const { getAllSkinToneVariations } = require('./features/skin-tones')
    return getAllSkinToneVariations(emoji)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'removeSkinTone', {
  value: (emoji: string) => {
    const { removeSkinTone } = require('./features/skin-tones')
    return removeSkinTone(emoji)
  },
  enumerable: false
})

// Alias methods
Object.defineProperty(emojis, 'aliases', {
  get: () => require('./data/aliases.json'),
  enumerable: false
})

Object.defineProperty(emojis, 'getAliases', {
  value: (name: string) => {
    const { getAliases } = require('./features/aliases')
    return getAliases(name)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'getPrimaryName', {
  value: (name: string) => {
    const { getPrimaryName } = require('./features/aliases')
    return getPrimaryName(name)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'isSameEmoji', {
  value: (name1: string, name2: string) => {
    const { isSameEmoji } = require('./features/aliases')
    return isSameEmoji(name1, name2)
  },
  enumerable: false
})

Object.defineProperty(emojis, 'getAllNamesForEmoji', {
  value: (name: string) => {
    const { getAllNames } = require('./features/aliases')
    return getAllNames(name)
  },
  enumerable: false
})

// Add skin tone data for backward compatibility
Object.defineProperty(emojis, 'skinTones', {
  get: () => {
    const modifiers = require('./data/skin-tones.json').modifiers
    return {
      // Numeric aliases
      '1': modifiers.light,
      '2': modifiers['medium-light'],
      '3': modifiers.medium,
      '4': modifiers['medium-dark'],
      '5': modifiers.dark,
      // Named versions
      light: modifiers.light,
      'medium-light': modifiers['medium-light'],
      medium: modifiers.medium,
      'medium-dark': modifiers['medium-dark'],
      dark: modifiers.dark
    }
  },
  enumerable: false
})

// Add skin tone constants - camelCase for backward compatibility
Object.defineProperty(emojis, 'skinToneModifiers', {
  get: () => require('./data/skin-tones.json').modifiers,
  enumerable: false
})

// Add skin tone constants - original uppercase
Object.defineProperty(emojis, 'SKIN_TONE_MODIFIERS', {
  get: () => require('./data/skin-tones.json').modifiers,
  enumerable: false
})

Object.defineProperty(emojis, 'SKIN_TONES', {
  get: () => ({
    '1': 'light',
    '2': 'medium-light',
    '3': 'medium',
    '4': 'medium-dark',
    '5': 'dark'
  }),
  enumerable: false
})

// Support alias access
const aliasData = require('./data/aliases.json')
Object.entries(aliasData).forEach(([primary, aliases]) => {
  (aliases as string[]).forEach(alias => {
    if (!(alias in emojis)) {
      Object.defineProperty(emojis, alias, {
        get: () => emojiData[primary as keyof typeof emojiData],
        enumerable: true
      })
    }
  })
})

// For CommonJS compatibility, we need to export emojis as the module
module.exports = emojis

// Also export as default for ES modules
module.exports.default = emojis

// Export the type
export default emojis

// Re-export features for tree-shaking (these are already exported via __exportStar)
// The named data exports are already available via getters on the emojis object
