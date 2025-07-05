export interface EmojiMetadata {
  /** The emoji character */
  emoji: string;
  /** The primary name/key for this emoji */
  name: string;
  /** The category this emoji belongs to */
  category: 'animals' | 'food' | 'nature' | 'people' | 'travel';
  /** Alternative names and related keywords for searching */
  keywords: string[];
  /** Unicode version when this emoji was introduced */
  unicodeVersion: string;
}

export type EmojiMetadataMap = {
  [name: string]: EmojiMetadata;
}

export interface SearchResult {
  name: string
  emoji: string
  metadata: EmojiMetadata
}