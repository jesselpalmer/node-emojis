import emojis from '../../data/emojis.json'
import metadata from '../../data/metadata.json'
import categories from '../../data/categories.json'

/**
 * Complete information about an emoji including metadata
 */
export interface EmojiInfo {
  /** The canonical name of the emoji */
  name: string
  /** The emoji character */
  emoji: string
  /** The category this emoji belongs to */
  category: string
  /** Array of keywords for searching */
  keywords: string[]
  /** The Unicode version when this emoji was introduced */
  unicodeVersion: string
}

/**
 * Filter emojis by category
 * 
 * Returns all emojis that belong to a specific category.
 * Categories are predefined groups like 'people', 'animals', 'food', etc.
 * 
 * @param category - The category name to filter by
 * @returns Array of emoji info objects for the specified category
 * 
 * @example
 * ```typescript
 * // Get all people emojis
 * filterByCategory('people')
 * // Returns: [
 * //   { name: 'smile', emoji: '😊', category: 'people', ... },
 * //   { name: 'laugh', emoji: '😂', category: 'people', ... },
 * //   ...
 * // ]
 * 
 * // Invalid category returns empty array
 * filterByCategory('invalid' as any)
 * // Returns: []
 * ```
 */
export function filterByCategory(category: keyof typeof categories): EmojiInfo[] {
  const emojiNames = categories[category] || []
  
  return emojiNames.map(name => {
    const meta = metadata[name as keyof typeof metadata]
    return {
      name,
      emoji: emojis[name as keyof typeof emojis],
      category: meta?.category || category,
      keywords: meta?.keywords || [],
      unicodeVersion: meta?.unicodeVersion || '1.0'
    }
  })
}

/**
 * Filter emojis by Unicode version
 * 
 * Find emojis based on when they were introduced in the Unicode standard.
 * Useful for ensuring compatibility with older systems.
 * 
 * @param version - The Unicode version to filter by (e.g., '13.0', '15.0')
 * @param comparison - How to compare versions:
 *   - 'exact': Only emojis from this exact version
 *   - 'min': Emojis from this version or newer (default)
 *   - 'max': Emojis from this version or older
 * @returns Array of emoji info objects matching the version criteria
 * 
 * @example
 * ```typescript
 * // Get emojis introduced in Unicode 13.0
 * filterByVersion('13.0', 'exact')
 * // Returns: [{ name: 'ninja', emoji: '🥷', unicodeVersion: '13.0', ... }]
 * 
 * // Get all emojis available in Unicode 12.0 or earlier
 * filterByVersion('12.0', 'max')
 * // Returns: All emojis with unicodeVersion <= '12.0'
 * 
 * // Get modern emojis (13.0+)
 * filterByVersion('13.0', 'min')
 * // Returns: All emojis with unicodeVersion >= '13.0'
 * ```
 */
export function filterByVersion(version: string, comparison: 'exact' | 'min' | 'max' = 'min'): EmojiInfo[] {
  const results: EmojiInfo[] = []
  
  Object.entries(emojis).forEach(([name, emoji]) => {
    const meta = metadata[name as keyof typeof metadata]
    const emojiVersion = meta?.unicodeVersion || '1.0'
    
    let include = false
    switch (comparison) {
      case 'exact':
        include = emojiVersion === version
        break
      case 'min':
        include = compareVersions(emojiVersion, version) >= 0
        break
      case 'max':
        include = compareVersions(emojiVersion, version) <= 0
        break
    }
    
    if (include) {
      results.push({
        name,
        emoji: emoji as string,
        category: meta?.category || 'other',
        keywords: meta?.keywords || [],
        unicodeVersion: emojiVersion
      })
    }
  })
  
  return results
}

/**
 * Filter emojis by keyword
 * 
 * Find emojis that have a specific keyword in their metadata.
 * Keywords are descriptive terms associated with each emoji for searching.
 * 
 * @param keyword - The keyword to search for
 * @param exact - If true, requires exact keyword match. If false, allows partial matches (default)
 * @returns Array of emoji info objects with matching keywords
 * 
 * @example
 * ```typescript
 * // Find emojis with 'happy' keyword (partial match)
 * filterByKeyword('happy')
 * // Returns: Emojis with keywords containing 'happy'
 * 
 * // Find emojis with exact 'love' keyword
 * filterByKeyword('love', true)
 * // Returns: Only emojis with exact keyword 'love', not 'lovely' or 'glove'
 * 
 * // Case-insensitive search
 * filterByKeyword('HAPPY')
 * // Returns: Same as filterByKeyword('happy')
 * ```
 */
export function filterByKeyword(keyword: string, exact = false): EmojiInfo[] {
  const searchTerm = keyword.toLowerCase()
  const results: EmojiInfo[] = []
  
  Object.entries(emojis).forEach(([name, emoji]) => {
    const meta = metadata[name as keyof typeof metadata]
    const keywords = meta?.keywords || []
    
    const match = exact
      ? keywords.some(k => k.toLowerCase() === searchTerm)
      : keywords.some(k => k.toLowerCase().includes(searchTerm))
    
    if (match) {
      results.push({
        name,
        emoji: emoji as string,
        category: meta?.category || 'other',
        keywords,
        unicodeVersion: meta?.unicodeVersion || '1.0'
      })
    }
  })
  
  return results
}

/**
 * Get all available Unicode versions
 * 
 * Returns a list of all Unicode versions that have emojis in the dataset,
 * sorted from oldest to newest.
 * 
 * @returns Sorted array of Unicode version strings
 * 
 * @example
 * ```typescript
 * getUnicodeVersions()
 * // Returns: ['1.0', '3.0', '6.0', '11.0', '12.0', '13.0', '14.0', '15.0']
 * 
 * // Use with filterByVersion to get emojis per version
 * const versions = getUnicodeVersions()
 * versions.forEach(v => {
 *   const emojis = filterByVersion(v, 'exact')
 *   console.log(`Unicode ${v}: ${emojis.length} emojis`)
 * })
 * ```
 */
export function getUnicodeVersions(): string[] {
  const versions = new Set<string>()
  
  Object.values(metadata).forEach(meta => {
    if (meta?.unicodeVersion) {
      versions.add(meta.unicodeVersion)
    }
  })
  
  return Array.from(versions).sort(compareVersions)
}

// Helper function to compare version strings
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number)
  const partsB = b.split('.').map(Number)
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0
    const partB = partsB[i] || 0
    
    if (partA !== partB) {
      return partA - partB
    }
  }
  
  return 0
}