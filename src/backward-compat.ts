/**
 * Backward compatibility layer for v0.x API
 * This module provides the legacy API interface for smooth migration
 */

import emojiData from './data/emojis.json'
import metadataData from './data/metadata.json'
import categoriesData from './data/categories.json'
import aliasData from './data/aliases.json'
import skinToneData from './data/skin-tones.json'

// Import functions for backward compatibility
import { search as searchFunction, getByCategory as getByCategoryFunction } from './features/search'
import { 
  applySkinTone as applySkinToneFunction,
  supportsSkinTone as supportsSkinToneFunction,
  getAllSkinToneVariations as getAllSkinToneVariationsFunction,
  removeSkinTone as removeSkinToneFunction
} from './features/skin-tones'
import {
  getAliases as getAliasesFunction,
  getPrimaryName as getPrimaryNameFunction,
  isSameEmoji as isSameEmojiFunction,
  getAllNames as getAllNamesFunction
} from './features/aliases'

// Helper function to define non-enumerable properties
function defineGetter(obj: any, name: string, getter: () => any) {
  Object.defineProperty(obj, name, {
    get: getter,
    enumerable: false
  })
}

// Helper function to define non-enumerable methods
function defineMethod(obj: any, name: string, method: (...args: any[]) => any) {
  Object.defineProperty(obj, name, {
    value: method,
    enumerable: false
  })
}

// Define the type for the main emojis object
export interface EmojisMain {
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

export function createBackwardCompatibleAPI(): EmojisMain {
  const emojis: EmojisMain = {} as EmojisMain
  
  // Copy all emoji properties
  Object.assign(emojis, emojiData)
  
  // Add getters for backward compatibility
  defineGetter(emojis, 'metadata', () => metadataData)
  
  defineGetter(emojis, 'categories', () => {
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
  })
  
  // For backward compatibility - add reverse mapping
  let cachedReverseMapping: Record<string, string> | null = null
  defineGetter(emojis, 'emojiToName', () => {
    if (!cachedReverseMapping) {
      cachedReverseMapping = {}
      Object.entries(emojiData).forEach(([name, emoji]) => {
        cachedReverseMapping![emoji as string] = name
      })
    }
    return cachedReverseMapping
  })
  
  defineGetter(emojis, 'reverseMapping', () => emojis.emojiToName)
  
  // Add backward compatibility methods
  defineMethod(emojis, 'searchByKeyword', (keyword: string) => {
    // Transform results for backward compatibility
    return searchFunction(keyword).map((result: any) => ({
      name: result.name,
      emoji: result.emoji,
      metadata: {
        keywords: result.keywords,
        category: result.category,
        unicodeVersion: metadataData[result.name as keyof typeof metadataData]?.unicodeVersion || '1.0'
      }
    }))
  })
  
  defineMethod(emojis, 'getByCategory', (category: string) => {
    // Transform results for backward compatibility
    return getByCategoryFunction(category).map((result: any) => ({
      name: result.name,
      emoji: result.emoji,
      metadata: {
        keywords: result.keywords,
        category: result.category,
        unicodeVersion: metadataData[result.name as keyof typeof metadataData]?.unicodeVersion || '1.0'
      }
    }))
  })
  
  defineMethod(emojis, 'getAllNames', () => Object.keys(emojiData))
  
  // Skin tone methods
  defineMethod(emojis, 'applySkinTone', (emoji: string, tone: any) => {
    return applySkinToneFunction(emoji, tone)
  })
  
  defineMethod(emojis, 'supportsSkinTone', (nameOrEmoji: string) => {
    return supportsSkinToneFunction(nameOrEmoji)
  })
  
  defineMethod(emojis, 'getAllSkinToneVariations', (emoji: string) => {
    return getAllSkinToneVariationsFunction(emoji)
  })
  
  defineMethod(emojis, 'removeSkinTone', (emoji: string) => {
    return removeSkinToneFunction(emoji)
  })
  
  // Alias methods
  defineGetter(emojis, 'aliases', () => aliasData)
  
  defineMethod(emojis, 'getAliases', (name: string) => {
    return getAliasesFunction(name)
  })
  
  defineMethod(emojis, 'getPrimaryName', (name: string) => {
    return getPrimaryNameFunction(name)
  })
  
  defineMethod(emojis, 'isSameEmoji', (name1: string, name2: string) => {
    return isSameEmojiFunction(name1, name2)
  })
  
  defineMethod(emojis, 'getAllNamesForEmoji', (name: string) => {
    return getAllNamesFunction(name)
  })
  
  // Add skin tone data for backward compatibility
  defineGetter(emojis, 'skinTones', () => {
    const modifiers = skinToneData.modifiers
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
  })
  
  // Add skin tone constants - camelCase for backward compatibility
  defineGetter(emojis, 'skinToneModifiers', () => skinToneData.modifiers)
  
  // Add skin tone constants - original uppercase
  defineGetter(emojis, 'SKIN_TONE_MODIFIERS', () => skinToneData.modifiers)
  
  defineGetter(emojis, 'SKIN_TONES', () => ({
    '1': 'light',
    '2': 'medium-light',
    '3': 'medium',
    '4': 'medium-dark',
    '5': 'dark'
  }))
  
  // Support alias access
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
  
  return emojis
}