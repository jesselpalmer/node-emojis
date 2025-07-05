import emojis from '../data/emojis.json'
import { SkinTone, SkinToneAlias } from '../features/skin-tones'

/**
 * Check if a string is a valid emoji character
 */
export function isValidEmoji(str: string): boolean {
  if (!str) return false
  
  // Check against known emojis first (most reliable)
  if (Object.values(emojis).includes(str as any)) {
    return true
  }
  
  // Basic emoji character ranges without problematic quantifiers
  // This regex avoids exponential backtracking by not using + after alternations
  const emojiRanges = [
    /^[\u{1F600}-\u{1F64F}]/u,  // Emoticons
    /^[\u{1F300}-\u{1F5FF}]/u,  // Miscellaneous Symbols and Pictographs
    /^[\u{1F680}-\u{1F6FF}]/u,  // Transport and Map Symbols
    /^[\u{1F700}-\u{1F77F}]/u,  // Alchemical Symbols
    /^[\u{1F780}-\u{1F7FF}]/u,  // Geometric Shapes Extended
    /^[\u{1F800}-\u{1F8FF}]/u,  // Supplemental Arrows-C
    /^[\u{2600}-\u{26FF}]/u,    // Miscellaneous Symbols
    /^[\u{2700}-\u{27BF}]/u,    // Dingbats
    /^[\u{1F900}-\u{1F9FF}]/u,  // Supplemental Symbols and Pictographs
    /^[\u{1FA00}-\u{1FA6F}]/u,  // Chess Symbols
    /^[\u{1FA70}-\u{1FAFF}]/u,  // Symbols and Pictographs Extended-A
    /^[\u{1F1E6}-\u{1F1FF}]/u   // Regional Indicator Symbols
  ]
  
  // Test if string starts with any emoji range
  return emojiRanges.some(regex => regex.test(str))
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
  return name.toLowerCase().replace(/[^a-z0-9_]/g, '_')
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