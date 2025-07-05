import emojis from '../data/emojis.json'

// Create reverse mapping on module load
const reverseMap: Record<string, string> = {}

Object.entries(emojis).forEach(([name, emoji]) => {
  reverseMap[emoji as string] = name
})

/**
 * Get emoji name from its character
 * 
 * Performs a reverse lookup to find the canonical name of an emoji
 * given its character representation.
 * 
 * @param emoji - The emoji character to look up
 * @returns The canonical name if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * // Find name from emoji
 * getNameFromEmoji('🔥')
 * // Returns: 'fire'
 * 
 * // Unknown emoji returns undefined
 * getNameFromEmoji('🌀')
 * // Returns: undefined
 * 
 * // Works with multi-character emojis
 * getNameFromEmoji('👨‍👩‍👧')
 * // Returns: 'family_man_woman_girl'
 * ```
 */
export function getNameFromEmoji(emoji: string): string | undefined {
  return reverseMap[emoji]
}

/**
 * Get the complete reverse mapping
 * 
 * Returns a frozen copy of the reverse emoji mapping (emoji → name).
 * Useful for bulk operations or building custom lookup tables.
 * 
 * @returns Read-only object mapping emoji characters to their names
 * 
 * @example
 * ```typescript
 * const reverseMap = getReverseMapping()
 * // Returns: {
 * //   '🔥': 'fire',
 * //   '😊': 'smile',
 * //   '👍': 'thumbsup',
 * //   // ... all other emojis
 * // }
 * 
 * // Use for lookups (read-only)
 * reverseMap['🔥'] // 'fire'
 * 
 * // Attempting to modify throws error
 * reverseMap['🔥'] = 'flame' // TypeError: Cannot assign to read only property
 * ```
 */
export function getReverseMapping(): Readonly<Record<string, string>> {
  return Object.freeze({ ...reverseMap })
}

/**
 * Check if a string is a valid emoji in the database
 * 
 * Verifies whether a given string is a recognized emoji character
 * in the node-emojis database.
 * 
 * @param str - The string to check
 * @returns true if the string is a known emoji, false otherwise
 * 
 * @example
 * ```typescript
 * // Known emoji
 * isKnownEmoji('🔥')
 * // Returns: true
 * 
 * // Unknown emoji
 * isKnownEmoji('🌀')
 * // Returns: false
 * 
 * // Not an emoji
 * isKnownEmoji('hello')
 * // Returns: false
 * 
 * // Works with complex emojis
 * isKnownEmoji('👨‍👩‍👧')
 * // Returns: true (if family emoji is in database)
 * ```
 */
export function isKnownEmoji(str: string): boolean {
  return str in reverseMap
}

/**
 * Create a reverse mapping from any emoji object
 * 
 * Utility function to create a reverse lookup table from any
 * name→emoji mapping. Useful for working with custom emoji sets.
 * 
 * @param emojiObject - Object mapping names to emoji characters
 * @returns New object mapping emoji characters to names
 * 
 * @example
 * ```typescript
 * // Create reverse mapping from custom set
 * const customEmojis = {
 *   happy: '😊',
 *   sad: '😢',
 *   fire: '🔥'
 * }
 * 
 * const reverseCustom = createReverseMapping(customEmojis)
 * // Returns: {
 * //   '😊': 'happy',
 * //   '😢': 'sad',
 * //   '🔥': 'fire'
 * // }
 * 
 * // Use for lookups
 * reverseCustom['🔥'] // 'fire'
 * ```
 */
export function createReverseMapping(emojiObject: Record<string, string>): Record<string, string> {
  const reverse: Record<string, string> = {}
  Object.entries(emojiObject).forEach(([name, emoji]) => {
    reverse[emoji] = name
  })
  return reverse
}