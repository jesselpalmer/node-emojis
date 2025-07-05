import emojis from '../data/emojis.json'
import { SkinTone, SkinToneAlias } from '../features/skin-tones'

// Create a Set for O(1) emoji lookups
const validEmojisSet = new Set(Object.values(emojis))

/**
 * Check if a string is a valid emoji character
 * 
 * This function uses a two-step validation approach:
 * 1. First checks against the known emoji database for exact matches (O(1) lookup)
 * 2. Falls back to regex validation for emojis that might not be in our database
 * 
 * The regex pattern covers Unicode ranges for:
 * - Emoticons (U+1F600-U+1F64F)
 * - Miscellaneous Symbols and Pictographs (U+1F300-U+1F5FF)
 * - Transport and Map Symbols (U+1F680-U+1F6FF)
 * - Supplemental Symbols and Pictographs (U+1F900-U+1F9FF, U+1FA00-U+1FAFF)
 * - Flags (U+1F1E6-U+1F1FF)
 * - Skin tone modifiers (U+1F3FB-U+1F3FF)
 * - Zero-width joiner (U+200D) and variation selector (U+FE0F)
 * 
 * Limitations:
 * - May not recognize very new emojis not yet in the database
 * - Complex emoji sequences with multiple components might not be fully validated
 * 
 * @param str - The string to validate
 * @returns true if the string is a valid emoji, false otherwise
 */
export function isValidEmoji(str: string): boolean {
  if (!str) return false
  
  // Check against known emojis first (most reliable) - O(1) lookup
  if (validEmojisSet.has(str as any)) {
    return true
  }
  
  // Additional check for common text characters to quickly reject mixed content
  if (/[a-zA-Z0-9\s]/.test(str)) {
    return false
  }
  
  // Use a character class approach without quantifiers to avoid ReDoS
  // This checks if the string consists only of emoji-related characters
  const emojiChars = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}]+$/u
  
  return emojiChars.test(str)
}

/**
 * Check if a string is a valid emoji name
 */
export function isValidEmojiName(name: string): boolean {
  if (!name) return false
  
  // Valid emoji names contain only letters, numbers, underscores, and hyphens
  const validNameRegex = /^[a-zA-Z0-9_-]+$/
  return validNameRegex.test(name)
}

/**
 * Check if a string is a valid skin tone
 */
export function isValidSkinTone(tone: string): tone is SkinTone | SkinToneAlias {
  const validTones = ['light', 'medium-light', 'medium', 'medium-dark', 'dark', '1', '2', '3', '4', '5']
  return validTones.includes(tone)
}

/**
 * Validate and sanitize emoji name
 */
export function sanitizeEmojiName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_')
}

/**
 * Check if a string contains variation selector
 */
export function hasVariationSelector(str: string): boolean {
  return str.includes('\u{FE0F}')
}

/**
 * Strip variation selectors from string
 */
export function stripVariationSelectors(str: string): string {
  return str.replace(/\u{FE0F}/gu, '')
}