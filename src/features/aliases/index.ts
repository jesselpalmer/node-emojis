import aliasData from '../../data/aliases.json'
import emojis from '../../data/emojis.json'

/**
 * Raw alias data mapping primary names to their aliases
 * @example
 * ```typescript
 * aliases['smile'] // ['happy', 'joy', 'pleased']
 * ```
 */
export const aliases = aliasData

/**
 * Get all aliases for an emoji name
 * 
 * Returns different results based on the input:
 * - If given a primary name: returns its aliases
 * - If given an alias: returns the primary name and other aliases
 * - If given an unknown name: returns empty array
 * 
 * @param name - The emoji name or alias to look up
 * @returns Array of aliases (excluding the input name itself)
 * 
 * @example
 * ```typescript
 * // Get aliases for a primary name
 * getAliases('smile')
 * // Returns: ['happy', 'joy', 'pleased']
 * 
 * // Get related names when given an alias
 * getAliases('happy') // (assuming 'happy' is an alias of 'smile')
 * // Returns: ['smile', 'joy', 'pleased']
 * 
 * // Unknown name returns empty array
 * getAliases('unknown')
 * // Returns: []
 * ```
 */
export function getAliases(name: string): string[] {
  // Check if this is a primary name with aliases
  if (aliasData[name as keyof typeof aliasData]) {
    return aliasData[name as keyof typeof aliasData]
  }
  
  // Check if this is an alias itself
  const primaryName = getPrimaryName(name)
  if (primaryName !== name && aliasData[primaryName as keyof typeof aliasData]) {
    return [primaryName, ...aliasData[primaryName as keyof typeof aliasData].filter(a => a !== name)]
  }
  
  return []
}

/**
 * Get the primary name for an emoji (resolves aliases)
 * 
 * This function normalizes emoji names by resolving aliases to their primary names.
 * If the input is already a primary name or is unknown, it returns the input unchanged.
 * 
 * @param name - The emoji name or alias to resolve
 * @returns The primary name if found, otherwise returns the input unchanged
 * 
 * @example
 * ```typescript
 * // Already a primary name
 * getPrimaryName('smile')
 * // Returns: 'smile'
 * 
 * // Resolve an alias
 * getPrimaryName('happy') // (assuming 'happy' is an alias of 'smile')
 * // Returns: 'smile'
 * 
 * // Unknown name returns unchanged
 * getPrimaryName('unknown')
 * // Returns: 'unknown'
 * ```
 */
export function getPrimaryName(name: string): string {
  // Check if this is already a primary name
  if (aliasData[name as keyof typeof aliasData]) {
    return name
  }
  
  // Find if this is an alias
  for (const [primary, aliasList] of Object.entries(aliasData)) {
    if ((aliasList as string[]).includes(name)) {
      return primary
    }
  }
  
  return name
}

/**
 * Check if two names refer to the same emoji
 * 
 * Compares two emoji names/aliases by resolving them to their primary names.
 * Useful for deduplication and equivalence checking.
 * 
 * @param name1 - First emoji name or alias
 * @param name2 - Second emoji name or alias
 * @returns true if both names refer to the same emoji, false otherwise
 * 
 * @example
 * ```typescript
 * // Same primary name
 * isSameEmoji('smile', 'smile')
 * // Returns: true
 * 
 * // Primary name vs alias
 * isSameEmoji('smile', 'happy') // (assuming 'happy' is an alias of 'smile')
 * // Returns: true
 * 
 * // Two different aliases of the same emoji
 * isSameEmoji('happy', 'joy') // (both aliases of 'smile')
 * // Returns: true
 * 
 * // Different emojis
 * isSameEmoji('smile', 'fire')
 * // Returns: false
 * ```
 */
export function isSameEmoji(name1: string, name2: string): boolean {
  const primary1 = getPrimaryName(name1)
  const primary2 = getPrimaryName(name2)
  return primary1 === primary2
}

/**
 * Get all names (primary + aliases) for an emoji
 * 
 * Returns a complete list of all names that can be used to refer to an emoji,
 * including both the primary name and all its aliases.
 * 
 * @param name - Any name or alias for the emoji
 * @returns Array with primary name first, followed by all aliases
 * 
 * @example
 * ```typescript
 * // Get all names starting from primary name
 * getAllNames('smile')
 * // Returns: ['smile', 'happy', 'joy', 'pleased']
 * 
 * // Get all names starting from an alias
 * getAllNames('happy') // (assuming 'happy' is an alias of 'smile')
 * // Returns: ['smile', 'happy', 'joy', 'pleased']
 * 
 * // Unknown name returns just that name
 * getAllNames('unknown')
 * // Returns: ['unknown']
 * ```
 */
export function getAllNames(name: string): string[] {
  const primaryName = getPrimaryName(name)
  const aliases = getAliases(primaryName)
  
  return [primaryName, ...aliases]
}

/**
 * Resolve an emoji name or alias to its character
 * 
 * Looks up an emoji character by name, automatically handling alias resolution.
 * This is the recommended way to get emoji characters as it handles both
 * primary names and aliases transparently.
 * 
 * @param nameOrAlias - The emoji name or alias to resolve
 * @returns The emoji character if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * // Resolve by primary name
 * resolveEmoji('fire')
 * // Returns: '🔥'
 * 
 * // Resolve by alias
 * resolveEmoji('flame') // (assuming 'flame' is an alias of 'fire')
 * // Returns: '🔥'
 * 
 * // Unknown name returns undefined
 * resolveEmoji('unknown')
 * // Returns: undefined
 * ```
 */
export function resolveEmoji(nameOrAlias: string): string | undefined {
  // Try direct lookup
  if (emojis[nameOrAlias as keyof typeof emojis]) {
    return emojis[nameOrAlias as keyof typeof emojis]
  }
  
  // Try resolving as alias
  const primaryName = getPrimaryName(nameOrAlias)
  return emojis[primaryName as keyof typeof emojis]
}

/**
 * Get a map of all aliases to their primary names
 * 
 * Builds and returns a reverse mapping from aliases to their primary names.
 * Useful for bulk operations or building lookup tables.
 * Note: This generates a new object each time, so cache the result if using repeatedly.
 * 
 * @returns Object mapping each alias to its primary emoji name
 * 
 * @example
 * ```typescript
 * const aliasMap = getAliasMap()
 * // Returns: {
 * //   'happy': 'smile',
 * //   'joy': 'smile', 
 * //   'pleased': 'smile',
 * //   'flame': 'fire',
 * //   'blaze': 'fire',
 * //   // ... all other aliases
 * // }
 * 
 * // Use for quick lookups
 * aliasMap['happy'] // 'smile'
 * aliasMap['flame'] // 'fire'
 * ```
 */
export function getAliasMap(): Record<string, string> {
  const map: Record<string, string> = {}
  
  Object.entries(aliasData).forEach(([primary, aliasList]) => {
    aliasList.forEach(alias => {
      map[alias] = primary
    })
  })
  
  return map
}