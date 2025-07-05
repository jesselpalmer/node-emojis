export interface Emoji {
  name: string
  char: string
  category: string
  keywords: string[]
  unicodeVersion: string
}

export interface EmojiDatabase {
  [name: string]: string
}

export interface EmojiMetadata {
  [name: string]: {
    keywords: string[]
    category: string
    unicodeVersion: string
  }
}

export interface EmojiWithMetadata extends Emoji {
  aliases?: string[]
  supportsSkinTone?: boolean
}