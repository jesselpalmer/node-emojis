import aliasData from '../../data/aliases.json'
import emojis from '../../data/emojis.json'

// Export the aliases data
export const aliases = aliasData

/**
 * Get all aliases for an emoji name
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
 */
export function isSameEmoji(name1: string, name2: string): boolean {
  const primary1 = getPrimaryName(name1)
  const primary2 = getPrimaryName(name2)
  return primary1 === primary2
}

/**
 * Get all names (primary + aliases) for an emoji
 */
export function getAllNames(name: string): string[] {
  const primaryName = getPrimaryName(name)
  const aliases = getAliases(primaryName)
  
  return [primaryName, ...aliases]
}

/**
 * Resolve an emoji name or alias to its character
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