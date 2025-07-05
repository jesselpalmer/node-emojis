import emojis from '../../data/emojis.json'
import metadata from '../../data/metadata.json'
import aliases from '../../data/aliases.json'

/**
 * Represents a search result for emoji queries
 */
export interface SearchResult {
  /** The canonical name of the emoji (e.g., 'fire', 'smile') */
  name: string
  /** The actual emoji character (e.g., '🔥', '😊') */
  emoji: string
  /** Array of keywords associated with this emoji for searching */
  keywords: string[]
  /** The category this emoji belongs to (e.g., 'people', 'animals') */
  category: string
  /** Relevance score (0-1) where 1.0 is exact match, 0.8 is keyword match, 0.6 is alias match */
  score?: number
}

// Build search indexes at module load time for O(1) lookups
interface SearchIndex {
  byName: Map<string, Set<string>>
  byKeyword: Map<string, Set<string>>
  byAlias: Map<string, Set<string>>
}

const searchIndex: SearchIndex = {
  byName: new Map(),
  byKeyword: new Map(),
  byAlias: new Map()
}

// Build the search index once at module load
function buildSearchIndex() {
  // Index by name
  Object.keys(emojis).forEach(name => {
    const lowerName = name.toLowerCase()
    // Index each substring of the name
    for (let i = 0; i < lowerName.length; i++) {
      for (let j = i + 1; j <= lowerName.length; j++) {
        const substring = lowerName.substring(i, j)
        if (!searchIndex.byName.has(substring)) {
          searchIndex.byName.set(substring, new Set())
        }
        searchIndex.byName.get(substring)!.add(name)
      }
    }
  })

  // Index by keywords
  Object.entries(metadata).forEach(([name, meta]) => {
    if (meta?.keywords) {
      meta.keywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        // Index full keyword and substrings
        for (let i = 0; i < lowerKeyword.length; i++) {
          for (let j = i + 1; j <= lowerKeyword.length; j++) {
            const substring = lowerKeyword.substring(i, j)
            if (!searchIndex.byKeyword.has(substring)) {
              searchIndex.byKeyword.set(substring, new Set())
            }
            searchIndex.byKeyword.get(substring)!.add(name)
          }
        }
      })
    }
  })

  // Index by aliases
  Object.entries(aliases).forEach(([primary, aliasList]) => {
    (aliasList as string[]).forEach(alias => {
      const lowerAlias = alias.toLowerCase()
      // Index full alias and substrings
      for (let i = 0; i < lowerAlias.length; i++) {
        for (let j = i + 1; j <= lowerAlias.length; j++) {
          const substring = lowerAlias.substring(i, j)
          if (!searchIndex.byAlias.has(substring)) {
            searchIndex.byAlias.set(substring, new Set())
          }
          searchIndex.byAlias.get(substring)!.add(primary)
        }
      }
    })
  })
}

// Build index on module load
buildSearchIndex()

/**
 * Search for emojis by keyword, name, or alias
 * 
 * This function uses pre-built indexes for O(1) substring matching performance.
 * Results are scored based on match type:
 * - Name matches: score 1.0
 * - Keyword matches: score 0.8  
 * - Alias matches: score 0.6
 * 
 * @param keyword - The search term to find emojis for
 * @returns Array of search results sorted by relevance score (highest first)
 * 
 * @example
 * ```typescript
 * // Search by name
 * search('fire')
 * // Returns: [{ name: 'fire', emoji: '🔥', score: 1.0, ... }]
 * 
 * // Search by keyword
 * search('happy')
 * // Returns: [{ name: 'smile', emoji: '😊', score: 0.8, ... }, ...]
 * 
 * // Search by alias
 * search('snapstreak')
 * // Returns: [{ name: 'fire', emoji: '🔥', score: 0.6, ... }]
 * 
 * // Partial matches work too
 * search('hap')
 * // Returns emojis with names/keywords/aliases containing 'hap'
 * ```
 */
export function search(keyword: string): SearchResult[] {
  const searchTerm = keyword.toLowerCase()
  const resultMap = new Map<string, SearchResult>()
  
  // Search in name index
  const nameMatches = searchIndex.byName.get(searchTerm) || new Set()
  nameMatches.forEach(name => {
    const meta = metadata[name as keyof typeof metadata]
    resultMap.set(name, {
      name,
      emoji: emojis[name as keyof typeof emojis] as string,
      keywords: meta?.keywords || [],
      category: meta?.category || 'other',
      score: 1.0
    })
  })
  
  // Search in keyword index
  const keywordMatches = searchIndex.byKeyword.get(searchTerm) || new Set()
  keywordMatches.forEach(name => {
    if (!resultMap.has(name)) {
      const meta = metadata[name as keyof typeof metadata]
      resultMap.set(name, {
        name,
        emoji: emojis[name as keyof typeof emojis] as string,
        keywords: meta?.keywords || [],
        category: meta?.category || 'other',
        score: 0.8
      })
    }
  })
  
  // Search in alias index
  const aliasMatches = searchIndex.byAlias.get(searchTerm) || new Set()
  aliasMatches.forEach(name => {
    if (!resultMap.has(name)) {
      const meta = metadata[name as keyof typeof metadata]
      resultMap.set(name, {
        name,
        emoji: emojis[name as keyof typeof emojis] as string,
        keywords: meta?.keywords || [],
        category: meta?.category || 'other',
        score: 0.6
      })
    }
  })
  
  // Convert to array and sort by score
  return Array.from(resultMap.values()).sort((a, b) => (b.score || 0) - (a.score || 0))
}

/**
 * Get all emojis that belong to a specific category
 * 
 * @param category - The category name to filter by (e.g., 'people', 'animals', 'food')
 * @returns Array of emojis in the specified category, or empty array if category doesn't exist
 * 
 * @example
 * ```typescript
 * // Get all animal emojis
 * getByCategory('animals')
 * // Returns: [
 * //   { name: 'cat', emoji: '🐈', category: 'animals', ... },
 * //   { name: 'dog', emoji: '🐕', category: 'animals', ... },
 * //   ...
 * // ]
 * 
 * // Invalid category returns empty array
 * getByCategory('invalid')
 * // Returns: []
 * ```
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
 * Get a list of all available emoji categories
 * 
 * @returns Sorted array of category names
 * 
 * @example
 * ```typescript
 * getCategories()
 * // Returns: ['animals', 'food', 'nature', 'people', 'travel', ...]
 * ```
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