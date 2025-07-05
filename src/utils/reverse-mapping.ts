import emojis from '../data/emojis.json'

// Create reverse mapping on module load
const reverseMap: Record<string, string> = {}

Object.entries(emojis).forEach(([name, emoji]) => {
  reverseMap[emoji as string] = name
})

/**
 * Get emoji name from its character
 */
export function getNameFromEmoji(emoji: string): string | undefined {
  return reverseMap[emoji]
}

/**
 * Get the complete reverse mapping
 */
export function getReverseMapping(): Readonly<Record<string, string>> {
  return reverseMap
}

/**
 * Check if a string is a valid emoji in the database
 */
export function isKnownEmoji(str: string): boolean {
  return str in reverseMap
}

/**
 * Create a reverse mapping from any emoji object
 */
export function createReverseMapping(emojiObject: Record<string, string>): Record<string, string> {
  const reverse: Record<string, string> = {}
  Object.entries(emojiObject).forEach(([name, emoji]) => {
    reverse[emoji] = name
  })
  return reverse
}