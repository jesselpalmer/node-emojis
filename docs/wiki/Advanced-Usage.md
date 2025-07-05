# Advanced Usage 🔧

Advanced patterns, optimization techniques, and best practices for node-emojis.

## Table of Contents

- [Tree Shaking](#tree-shaking)
- [Performance Optimization](#performance-optimization)
- [Custom Integrations](#custom-integrations)
- [Memory Management](#memory-management)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Tree Shaking

### Bundle Size Optimization

node-emojis is designed to be tree-shakeable, allowing you to import only what you need:

```javascript
// ❌ Large bundle - imports everything
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')
const { applySkinTone } = require('node-emojis/skin-tones')

// ✅ Optimal bundle - import only needed features
const { search } = require('node-emojis/search')
const animals = require('node-emojis/animals')
```

### Webpack Configuration

Ensure your webpack setup supports tree shaking:

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false
  },
  resolve: {
    mainFields: ['module', 'main']
  }
}
```

### Bundle Analysis

Check what's included in your bundle:

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts
"analyze": "webpack-bundle-analyzer dist/main.js"

# Run analysis
npm run analyze
```

### Category-Specific Imports

Import only the emoji categories you need:

```javascript
// Only import specific categories
const people = require('node-emojis/people')     // ~50kb
const animals = require('node-emojis/animals')   // ~30kb
const food = require('node-emojis/food')         // ~40kb

// Instead of importing everything
const emojis = require('node-emojis')            // ~200kb
```

---

## Performance Optimization

### Lazy Loading

Load emoji data on demand:

```javascript
class EmojiLoader {
  constructor() {
    this.cache = new Map()
    this.loading = new Map()
  }

  async loadCategory(category) {
    // Return cached if available
    if (this.cache.has(category)) {
      return this.cache.get(category)
    }

    // Prevent duplicate loads
    if (this.loading.has(category)) {
      return this.loading.get(category)
    }

    // Load category
    const loadPromise = this.fetchCategory(category)
    this.loading.set(category, loadPromise)

    try {
      const data = await loadPromise
      this.cache.set(category, data)
      return data
    } finally {
      this.loading.delete(category)
    }
  }

  async fetchCategory(category) {
    const { getByCategory } = require('node-emojis/search')
    return getByCategory(category)
  }
}
```

### Search Optimization

Optimize search performance with memoization:

```javascript
const { search } = require('node-emojis/search')

class OptimizedSearch {
  constructor(maxCacheSize = 100) {
    this.cache = new Map()
    this.maxCacheSize = maxCacheSize
  }

  search(query) {
    const normalizedQuery = query.toLowerCase().trim()
    
    // Return cached result
    if (this.cache.has(normalizedQuery)) {
      return this.cache.get(normalizedQuery)
    }

    // Perform search
    const results = search(normalizedQuery)
    
    // Cache with LRU eviction
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(normalizedQuery, results)
    return results
  }

  clearCache() {
    this.cache.clear()
  }
}
```

### Debounced Search

Implement debounced search for better UX:

```javascript
class DebouncedSearch {
  constructor(delay = 300) {
    this.delay = delay
    this.timeoutId = null
    this.searcher = new OptimizedSearch()
  }

  search(query, callback) {
    clearTimeout(this.timeoutId)
    
    this.timeoutId = setTimeout(() => {
      const results = this.searcher.search(query)
      callback(results)
    }, this.delay)
  }

  immediate(query) {
    clearTimeout(this.timeoutId)
    return this.searcher.search(query)
  }
}

// Usage
const debouncedSearch = new DebouncedSearch(250)

// In your UI
function handleSearchInput(event) {
  const query = event.target.value
  
  debouncedSearch.search(query, (results) => {
    updateSearchResults(results)
  })
}
```

---

## Custom Integrations

### React Hook

Create a custom React hook for emojis:

```javascript
import { useState, useEffect, useMemo } from 'react'
import { search } from 'node-emojis/search'

export function useEmojiSearch(query, options = {}) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  const { debounce = 300, maxResults = 50 } = options

  const debouncedQuery = useDebounce(query, debounce)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    // Use setTimeout to prevent blocking
    const timeoutId = setTimeout(() => {
      try {
        const searchResults = search(debouncedQuery)
          .slice(0, maxResults)
        setResults(searchResults)
      } catch (error) {
        console.error('Emoji search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [debouncedQuery, maxResults])

  return { results, loading }
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Express.js Middleware

Add emoji support to your Express app:

```javascript
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

function emojiMiddleware(options = {}) {
  const { enableSearch = true, enableSkinTones = true } = options

  return (req, res, next) => {
    // Add emoji utilities to response locals
    res.locals.emojis = emojis
    
    // Add search function
    if (enableSearch) {
      res.locals.searchEmojis = search
    }

    // Add skin tone utilities
    if (enableSkinTones) {
      const { applySkinTone } = require('node-emojis/skin-tones')
      res.locals.applySkinTone = applySkinTone
    }

    // Add template helper
    res.locals.emoji = (name) => emojis[name] || '❓'

    next()
  }
}

// Usage
const express = require('express')
const app = express()

app.use(emojiMiddleware())

app.get('/', (req, res) => {
  res.send(`Hello ${res.locals.emoji('wave')}!`)
})
```

### CLI Integration

Add emoji support to CLI applications:

```javascript
const emojis = require('node-emojis')

class EmojiCLI {
  constructor(options = {}) {
    this.options = {
      enabled: true,
      fallback: '',
      ...options
    }
  }

  format(message) {
    if (!this.options.enabled) {
      return this.stripEmojis(message)
    }

    return message.replace(/:(\w+):/g, (match, name) => {
      return emojis[name] || this.options.fallback || match
    })
  }

  stripEmojis(message) {
    return message.replace(/:(\w+):/g, '')
  }

  log(level, message) {
    const icons = {
      info: emojis.information_source,
      success: emojis.white_check_mark,
      warning: emojis.warning,
      error: emojis.x
    }

    const icon = this.options.enabled ? icons[level] || '' : ''
    console.log(`${icon} ${this.format(message)}`)
  }

  progress(current, total, message = '') {
    if (!this.options.enabled) {
      console.log(`[${current}/${total}] ${message}`)
      return
    }

    const percentage = Math.round((current / total) * 100)
    const filled = Math.round(percentage / 10)
    const empty = 10 - filled
    
    const bar = emojis.green_square.repeat(filled) + 
                emojis.white_large_square.repeat(empty)
    
    console.log(`${bar} ${percentage}% ${message}`)
  }
}
```

---

## Memory Management

### Efficient Data Loading

Minimize memory usage with selective imports:

```javascript
class EmojiManager {
  constructor() {
    this.loadedCategories = new Set()
    this.categoryData = new Map()
  }

  async loadCategory(category) {
    if (this.loadedCategories.has(category)) {
      return this.categoryData.get(category)
    }

    // Dynamic import to reduce initial bundle
    const { getByCategory } = await import('node-emojis/search')
    const data = getByCategory(category)
    
    this.categoryData.set(category, data)
    this.loadedCategories.add(category)
    
    return data
  }

  unloadCategory(category) {
    this.categoryData.delete(category)
    this.loadedCategories.delete(category)
  }

  getMemoryUsage() {
    return {
      loadedCategories: this.loadedCategories.size,
      totalEmojis: Array.from(this.categoryData.values())
        .reduce((sum, cat) => sum + cat.length, 0)
    }
  }
}
```

### Garbage Collection Optimization

```javascript
class EmojiCache {
  constructor(maxAge = 300000) { // 5 minutes
    this.cache = new Map()
    this.timers = new Map()
    this.maxAge = maxAge
  }

  set(key, value) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    // Set value
    this.cache.set(key, value)

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key)
    }, this.maxAge)
    
    this.timers.set(key, timer)
  }

  get(key) {
    return this.cache.get(key)
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
    return this.cache.delete(key)
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    this.cache.clear()
  }

  getStats() {
    return {
      size: this.cache.size,
      memory: process.memoryUsage().heapUsed
    }
  }
}
```

---

## Error Handling

### Graceful Degradation

Handle missing emojis gracefully:

```javascript
const emojis = require('node-emojis')

class SafeEmojiAccess {
  constructor(fallback = '❓') {
    this.fallback = fallback
    this.missingEmojis = new Set()
  }

  get(name) {
    try {
      const emoji = emojis[name]
      
      if (emoji) {
        return emoji
      }

      // Log missing emoji once
      if (!this.missingEmojis.has(name)) {
        console.warn(`Emoji not found: ${name}`)
        this.missingEmojis.add(name)
      }

      return this.fallback
    } catch (error) {
      console.error(`Error accessing emoji '${name}':`, error)
      return this.fallback
    }
  }

  exists(name) {
    return name in emojis
  }

  getMissingEmojis() {
    return Array.from(this.missingEmojis)
  }
}
```

### Search Error Handling

```javascript
const { search } = require('node-emojis/search')

class RobustSearch {
  constructor() {
    this.errorCount = 0
    this.maxErrors = 10
  }

  search(query) {
    try {
      // Validate input
      if (typeof query !== 'string') {
        throw new Error('Search query must be a string')
      }

      if (query.length > 100) {
        throw new Error('Search query too long')
      }

      // Reset error count on successful search
      const results = search(query)
      this.errorCount = 0
      return results

    } catch (error) {
      this.errorCount++
      
      if (this.errorCount >= this.maxErrors) {
        console.error('Too many search errors, disabling search')
        return []
      }

      console.warn(`Search error for "${query}":`, error.message)
      return []
    }
  }

  isHealthy() {
    return this.errorCount < this.maxErrors
  }
}
```

---

## Best Practices

### 1. Import Strategy

```javascript
// ✅ Good: Import only what you need
const { search } = require('node-emojis/search')
const animals = require('node-emojis/animals')

// ❌ Avoid: Importing everything when you need little
const emojis = require('node-emojis')
```

### 2. Caching Strategy

```javascript
// ✅ Good: Cache search results
const searchCache = new Map()

function cachedSearch(query) {
  if (searchCache.has(query)) {
    return searchCache.get(query)
  }
  
  const results = search(query)
  searchCache.set(query, results)
  return results
}

// ✅ Good: Clear cache periodically
setInterval(() => searchCache.clear(), 300000) // 5 minutes
```

### 3. Error Boundaries

```javascript
// ✅ Good: Wrap emoji operations in try-catch
function safeEmojiOperation(callback) {
  try {
    return callback()
  } catch (error) {
    console.warn('Emoji operation failed:', error)
    return null
  }
}
```

### 4. TypeScript Usage

```typescript
// ✅ Good: Use proper types
import { SearchResult } from 'node-emojis/search'

function processResults(results: SearchResult[]): string[] {
  return results.map(r => `${r.emoji} ${r.name}`)
}
```

### 5. Testing Strategy

```javascript
// ✅ Good: Test emoji functionality
describe('Emoji functionality', () => {
  it('should return valid emojis', () => {
    const fire = emojis.fire
    expect(fire).toBe('🔥')
    expect(typeof fire).toBe('string')
  })

  it('should handle search gracefully', () => {
    const results = search('nonexistent')
    expect(Array.isArray(results)).toBe(true)
  })
})
```

---

Need more advanced examples? Check our [GitHub discussions](https://github.com/jesselpalmer/node-emojis/discussions) or contribute your own patterns!

---

Last updated: July 2025 | Version: 1.0.0
