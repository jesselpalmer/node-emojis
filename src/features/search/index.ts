import emojis from '../../data/emojis.json'
import metadata from '../../data/metadata.json'
import aliases from '../../data/aliases.json'

export interface SearchResult {
  name: string
  emoji: string
  keywords: string[]
  category: string
  score?: number
}

/**
 * Search emojis by keyword
 */
export function search(keyword: string): SearchResult[] {
  const searchTerm = keyword.toLowerCase()
  const results: SearchResult[] = []
  
  // Search in emoji names
  Object.entries(emojis).forEach(([name, emoji]) => {
    const meta = metadata[name as keyof typeof metadata]
    const nameMatch = name.toLowerCase().includes(searchTerm)
    const keywordMatch = meta?.keywords.some(k => k.toLowerCase().includes(searchTerm))
    
    // Check aliases
    const aliasMatch = Object.entries(aliases).some(([primary, aliasList]) => {
      return (primary === name || (aliasList as string[]).includes(name)) && 
             (aliasList as string[]).some(alias => alias.toLowerCase().includes(searchTerm))
    })
    
    if (nameMatch || keywordMatch || aliasMatch) {
      results.push({
        name,
        emoji: emoji as string,
        keywords: meta?.keywords || [],
        category: meta?.category || 'other',
        score: nameMatch ? 1.0 : keywordMatch ? 0.8 : 0.6
      })
    }
  })
  
  // Sort by score
  return results.sort((a, b) => (b.score || 0) - (a.score || 0))
}

/**
 * Get all emojis by category
 */
export function getByCategory(category: string): SearchResult[] {
  return Object.entries(emojis)
    .filter(([name]) => {
      const meta = metadata[name as keyof typeof metadata]
      return meta?.category === category
    })
    .map(([name, emoji]) => {
      const meta = metadata[name as keyof typeof metadata]
      return {
        name,
        emoji: emoji as string,
        keywords: meta?.keywords || [],
        category: meta?.category || 'other'
      }
    })
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set<string>()
  Object.values(metadata).forEach(meta => {
    if (meta?.category) {
      categories.add(meta.category)
    }
  })
  return Array.from(categories).sort()
}