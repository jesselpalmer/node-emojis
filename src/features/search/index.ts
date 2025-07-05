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
 * Search emojis by keyword using pre-built indexes for O(1) lookups
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