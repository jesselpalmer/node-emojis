import skinToneData from '../../data/skin-tones.json'
import emojis from '../../data/emojis.json'
import aliases from '../../data/aliases.json'

export type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'
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