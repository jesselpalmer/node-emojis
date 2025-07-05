import emojis from '../../data/emojis.json'
import metadata from '../../data/metadata.json'
import categories from '../../data/categories.json'

export interface EmojiInfo {
  name: string
  emoji: string
  category: string
  keywords: string[]
  unicodeVersion: string
}

/**
 * Filter emojis by category
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