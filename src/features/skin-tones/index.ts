import skinToneData from '../../data/skin-tones.json'
import emojis from '../../data/emojis.json'
import aliases from '../../data/aliases.json'

/** Valid skin tone modifier names */
export type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'

/** Numeric aliases for skin tones (1-5) */
export type SkinToneAlias = '1' | '2' | '3' | '4' | '5'

const SKIN_TONE_ALIASES: Record<SkinToneAlias, SkinTone> = {
  '1': 'light',
  '2': 'medium-light', 
  '3': 'medium',
  '4': 'medium-dark',
  '5': 'dark'
}

/**
 * Apply a skin tone modifier to an emoji
 * 
 * This function removes any existing skin tone modifiers before applying the new one.
 * Supports both named tones ('light', 'medium-dark') and numeric aliases ('1', '4').
 * 
 * @param emoji - The emoji character to modify (e.g., '👋' or '👋🏻')
 * @param tone - The skin tone to apply (name or numeric alias)
 * @returns The emoji with the specified skin tone modifier applied
 * @throws {Error} If the tone parameter is invalid
 * 
 * @example
 * ```typescript
 * // Apply skin tone by name
 * applySkinTone('👋', 'dark')
 * // Returns: '👋🏿'
 * 
 * // Apply skin tone by numeric alias
 * applySkinTone('👋', '3')
 * // Returns: '👋🏽' (medium)
 * 
 * // Replace existing skin tone
 * applySkinTone('👋🏻', 'dark')
 * // Returns: '👋🏿'
 * ```
 */
export function applySkinTone(emoji: string, tone: SkinTone | SkinToneAlias): string {
  const modifier = typeof tone === 'string' && tone in SKIN_TONE_ALIASES
    ? skinToneData.modifiers[SKIN_TONE_ALIASES[tone as SkinToneAlias]]
    : skinToneData.modifiers[tone as SkinTone]
  
  if (!modifier) {
    throw new Error(`Invalid skin tone: ${tone}`)
  }
  
  // Remove any existing skin tone modifiers and variation selectors
  const baseEmoji = removeSkinTone(emoji)
  
  return baseEmoji + modifier
}

/**
 * Check if an emoji supports skin tone variations
 * 
 * Works with both emoji names and emoji characters. Also checks aliases.
 * 
 * @param nameOrEmoji - Either an emoji name (e.g., 'wave') or emoji character (e.g., '👋')
 * @returns true if the emoji supports skin tone modifiers, false otherwise
 * 
 * @example
 * ```typescript
 * // Check by name
 * supportsSkinTone('wave')
 * // Returns: true
 * 
 * // Check by emoji character
 * supportsSkinTone('👋')
 * // Returns: true
 * 
 * // Check by alias
 * supportsSkinTone('hand_wave')
 * // Returns: true
 * 
 * // Non-human emojis don't support skin tones
 * supportsSkinTone('fire')
 * // Returns: false
 * ```
 */
export function supportsSkinTone(nameOrEmoji: string): boolean {
  // Check if it's an emoji character or a name
  const emojiName = emojis[nameOrEmoji as keyof typeof emojis] ? nameOrEmoji : getNameFromEmoji(nameOrEmoji)
  
  if (!emojiName) return false
  
  // Check if it's in the capable list
  if (skinToneData.capable.includes(emojiName)) return true
  
  // Check aliases
  const primaryName = getPrimaryName(emojiName)
  return skinToneData.capable.includes(primaryName)
}

/**
 * Get all skin tone variations of an emoji
 * 
 * Returns an object with all possible skin tone variations including the default (no modifier).
 * 
 * @param emoji - The emoji character to get variations for
 * @returns Object mapping tone names to emoji variations
 * 
 * @example
 * ```typescript
 * getAllSkinToneVariations('👋')
 * // Returns: {
 * //   default: '👋',
 * //   light: '👋🏻',
 * //   'medium-light': '👋🏼',
 * //   medium: '👋🏽',
 * //   'medium-dark': '👋🏾',
 * //   dark: '👋🏿'
 * // }
 * 
 * // Works with emojis that already have skin tone
 * getAllSkinToneVariations('👋🏻')
 * // Returns same as above (strips existing tone first)
 * ```
 */
export function getAllSkinToneVariations(emoji: string): Record<SkinTone | 'default', string> {
  const baseEmoji = removeSkinTone(emoji)
  
  return {
    default: baseEmoji,
    light: applySkinTone(baseEmoji, 'light'),
    'medium-light': applySkinTone(baseEmoji, 'medium-light'),
    medium: applySkinTone(baseEmoji, 'medium'),
    'medium-dark': applySkinTone(baseEmoji, 'medium-dark'),
    dark: applySkinTone(baseEmoji, 'dark')
  }
}

/**
 * Remove skin tone modifier from an emoji
 * 
 * Strips all skin tone modifiers and variation selectors to return the base emoji.
 * Safe to use on emojis without skin tones.
 * 
 * @param emoji - The emoji character to remove skin tone from
 * @returns The base emoji without any skin tone modifiers
 * 
 * @example
 * ```typescript
 * // Remove skin tone
 * removeSkinTone('👋🏿')
 * // Returns: '👋'
 * 
 * // Multiple skin tones (family emojis)
 * removeSkinTone('👨🏻‍👩🏾‍👧🏽')
 * // Returns: '👨‍👩‍👧'
 * 
 * // No skin tone - returns unchanged
 * removeSkinTone('🔥')
 * // Returns: '🔥'
 * ```
 */
export function removeSkinTone(emoji: string): string {
  // Remove all skin tone modifiers
  let result = emoji
  Object.values(skinToneData.modifiers).forEach(modifier => {
    result = result.replace(new RegExp(modifier, 'g'), '')
  })
  
  // Also remove variation selectors
  result = result.replace(/[\u{FE0F}\u{200D}]/gu, '')
  
  return result
}

// Helper functions
function getNameFromEmoji(emoji: string): string | null {
  const entry = Object.entries(emojis).find(([_, e]) => e === emoji)
  return entry ? entry[0] : null
}

function getPrimaryName(name: string): string {
  // Check if this name is already primary
  if (aliases[name as keyof typeof aliases]) {
    return name
  }
  
  // Find if this is an alias
  const entry = Object.entries(aliases).find(([_, aliasList]) => 
    (aliasList as string[]).includes(name)
  )
  
  return entry ? entry[0] : name
}

// Export constants
export const SKIN_TONE_MODIFIERS = skinToneData.modifiers
export const SKIN_TONE_CAPABLE_EMOJIS = skinToneData.capable