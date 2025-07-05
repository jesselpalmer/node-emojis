/**
 * Basic emoji structure with core properties
 */
export interface Emoji {
  /** The canonical name of the emoji (e.g., 'fire', 'smile') */
  name: string
  /** The emoji character (e.g., '🔥', '😊') */
  char: string
  /** The category this emoji belongs to (e.g., 'people', 'animals') */
  category: string
  /** Array of keywords for searching this emoji */
  keywords: string[]
  /** The Unicode version when this emoji was introduced */
  unicodeVersion: string
}

/**
 * Simple emoji database mapping names to characters
 */
export interface EmojiDatabase {
  /** Maps emoji names to their characters */
  [name: string]: string
}

/**
 * Emoji metadata database containing additional information
 */
export interface EmojiMetadata {
  /** Maps emoji names to their metadata */
  [name: string]: {
    /** Keywords for searching */
    keywords: string[]
    /** Category classification */
    category: string
    /** Unicode version of introduction */
    unicodeVersion: string
  }
}

/**
 * Extended emoji information including optional properties
 */
export interface EmojiWithMetadata extends Emoji {
  /** Alternative names for this emoji */
  aliases?: string[]
  /** Whether this emoji supports skin tone modifiers */
  supportsSkinTone?: boolean
}