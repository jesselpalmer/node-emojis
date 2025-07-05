# Recipes & Examples 🍳

Practical examples and common patterns for using node-emojis in your projects.

## Table of Contents

- [Console Applications](#console-applications)
- [Web Applications](#web-applications)
- [CLI Tools](#cli-tools)
- [Logging & Monitoring](#logging--monitoring)
- [Chat & Messaging](#chat--messaging)
- [Testing](#testing)
- [Advanced Patterns](#advanced-patterns)

---

## Console Applications

### Colorful Console Messages

```javascript
const emojis = require('node-emojis')

function logWithEmoji(level, message) {
  const icons = {
    success: emojis.white_check_mark,
    warning: emojis.warning,
    error: emojis.x,
    info: emojis.information_source
  }
  
  console.log(`${icons[level]} ${message}`)
}

logWithEmoji('success', 'Build completed!')
logWithEmoji('warning', 'Deprecated API used')
logWithEmoji('error', 'Connection failed')
logWithEmoji('info', 'Starting server...')
```

### Progress Indicators

```javascript
const emojis = require('node-emojis')

function showProgress(current, total) {
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round(percentage / 10)
  const empty = 10 - filled
  
  const bar = emojis.green_square.repeat(filled) + 
              emojis.white_large_square.repeat(empty)
  
  console.log(`${bar} ${percentage}% (${current}/${total})`)
}

// Usage
for (let i = 0; i <= 10; i++) {
  showProgress(i, 10)
}
```

---

## Web Applications

### React Component with Emoji Picker

```jsx
import emojis from 'node-emojis'
import { search } from 'node-emojis/search'
import { useState } from 'react'

function EmojiPicker({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const results = searchTerm ? search(searchTerm) : []

  return (
    <div className="emoji-picker">
      <input
        type="text"
        placeholder="Search emojis..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="emoji-grid">
        {results.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => onSelect(emoji)}
            title={name}
            className="emoji-button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Vue.js Emoji Reactions

```vue
<template>
  <div class="emoji-reactions">
    <button
      v-for="reaction in reactions"
      :key="reaction.name"
      @click="toggleReaction(reaction.name)"
      :class="{ active: userReactions.includes(reaction.name) }"
      class="reaction-button"
    >
      {{ reaction.emoji }} {{ reaction.count }}
    </button>
  </div>
</template>

<script>
import emojis from 'node-emojis'

export default {
  data() {
    return {
      reactions: [
        { name: 'thumbsup', emoji: emojis.thumbsup, count: 0 },
        { name: 'heart', emoji: emojis.heart, count: 0 },
        { name: 'fire', emoji: emojis.fire, count: 0 },
        { name: 'rocket', emoji: emojis.rocket, count: 0 }
      ],
      userReactions: []
    }
  },
  methods: {
    toggleReaction(name) {
      // Implementation for toggling reactions
    }
  }
}
</script>
```

### Svelte Emoji Status

```svelte
<script>
  import emojis from 'node-emojis'
  
  export let status = 'online'
  
  const statusEmojis = {
    online: emojis.green_circle,
    away: emojis.yellow_circle,
    busy: emojis.red_circle,
    offline: emojis.black_circle
  }
  
  $: emoji = statusEmojis[status] || statusEmojis.offline
</script>

<div class="user-status">
  <span class="status-emoji">{emoji}</span>
  <span class="status-text">{status}</span>
</div>
```

---

## CLI Tools

### Command Output Enhancement

```javascript
#!/usr/bin/env node
const emojis = require('node-emojis')
const { Command } = require('commander')

const program = new Command()

program
  .command('deploy')
  .description('Deploy application')
  .action(async () => {
    console.log(`${emojis.rocket} Starting deployment...`)
    
    try {
      // Deployment logic
      await deploy()
      console.log(`${emojis.white_check_mark} Deployment successful!`)
    } catch (error) {
      console.error(`${emojis.x} Deployment failed: ${error.message}`)
      process.exit(1)
    }
  })

program.parse()
```

### Interactive CLI with Emojis

```javascript
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askForEmoji() {
  rl.question(`${emojis.thinking_face} Search for an emoji: `, (answer) => {
    const results = search(answer)
    
    if (results.length === 0) {
      console.log(`${emojis.confused} No emojis found for "${answer}"`)
    } else {
      console.log(`${emojis.mag} Found ${results.length} emojis:`)
      results.slice(0, 5).forEach(({ name, emoji }) => {
        console.log(`  ${emoji} :${name}:`)
      })
    }
    
    askForEmoji()
  })
}

console.log(`${emojis.wave} Welcome to Emoji Search!`)
askForEmoji()
```

---

## Logging & Monitoring

### Structured Logging

```javascript
const emojis = require('node-emojis')

class EmojiLogger {
  constructor() {
    this.levels = {
      debug: { emoji: emojis.bug, color: '\x1b[36m' },
      info: { emoji: emojis.information_source, color: '\x1b[34m' },
      warn: { emoji: emojis.warning, color: '\x1b[33m' },
      error: { emoji: emojis.x, color: '\x1b[31m' },
      success: { emoji: emojis.white_check_mark, color: '\x1b[32m' }
    }
  }

  log(level, message, meta = {}) {
    const { emoji, color } = this.levels[level] || this.levels.info
    const timestamp = new Date().toISOString()
    const reset = '\x1b[0m'
    
    console.log(
      `${color}${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}${reset}`,
      meta
    )
  }

  debug(message, meta) { this.log('debug', message, meta) }
  info(message, meta) { this.log('info', message, meta) }
  warn(message, meta) { this.log('warn', message, meta) }
  error(message, meta) { this.log('error', message, meta) }
  success(message, meta) { this.log('success', message, meta) }
}

// Usage
const logger = new EmojiLogger()
logger.info('Server starting...')
logger.success('Server started on port 3000')
logger.warn('High memory usage detected')
logger.error('Database connection failed')
```

### Performance Monitoring

```javascript
const emojis = require('node-emojis')

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
  }

  start(operation) {
    this.metrics.set(operation, {
      startTime: process.hrtime.bigint(),
      emoji: this.getOperationEmoji(operation)
    })
  }

  end(operation) {
    const metric = this.metrics.get(operation)
    if (!metric) return

    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - metric.startTime) / 1000000 // ms

    console.log(
      `${metric.emoji} ${operation} completed in ${duration.toFixed(2)}ms`
    )

    this.metrics.delete(operation)
  }

  getOperationEmoji(operation) {
    const emojiMap = {
      'database-query': emojis.card_file_box,
      'api-request': emojis.satellite,
      'file-processing': emojis.page_facing_up,
      'image-processing': emojis.framed_picture,
      'build': emojis.hammer_and_wrench,
      'test': emojis.test_tube
    }
    
    return emojiMap[operation] || emojis.stopwatch
  }
}

// Usage
const monitor = new PerformanceMonitor()

monitor.start('database-query')
await db.query('SELECT * FROM users')
monitor.end('database-query')
```

---

## Chat & Messaging

### Slack Bot Messages

```javascript
const emojis = require('node-emojis')
const { applySkinTone } = require('node-emojis/skin-tones')

class SlackBot {
  sendDeploymentNotification(status, environment, details) {
    const messages = {
      started: {
        emoji: emojis.rocket,
        color: 'warning',
        text: `Deployment to ${environment} started`
      },
      success: {
        emoji: emojis.white_check_mark,
        color: 'good',
        text: `Deployment to ${environment} successful`
      },
      failed: {
        emoji: emojis.x,
        color: 'danger',
        text: `Deployment to ${environment} failed`
      }
    }

    const message = messages[status]
    
    return {
      text: `${message.emoji} ${message.text}`,
      attachments: [{
        color: message.color,
        fields: [
          { title: 'Environment', value: environment, short: true },
          { title: 'Build ID', value: details.buildId, short: true },
          { title: 'Duration', value: details.duration, short: true }
        ]
      }]
    }
  }

  sendTeamCelebration(achievement) {
    const celebrationEmojis = [
      emojis.tada, emojis.party_popper, emojis.confetti_ball,
      emojis.clapping_hands, emojis.fire, emojis.star2
    ]
    
    const randomEmoji = celebrationEmojis[
      Math.floor(Math.random() * celebrationEmojis.length)
    ]
    
    return {
      text: `${randomEmoji} Team Achievement: ${achievement} ${randomEmoji}`,
      response_type: 'in_channel'
    }
  }
}
```

### Discord Rich Presence

```javascript
const emojis = require('node-emojis')

function updateDiscordStatus(activity, details) {
  const statusEmojis = {
    coding: emojis.technologist,
    debugging: emojis.bug,
    meeting: emojis.busts_in_silhouette,
    break: emojis.coffee,
    learning: emojis.books
  }

  return {
    state: details,
    details: `${statusEmojis[activity]} ${activity}`,
    largeImageKey: 'app-icon',
    smallImageKey: 'status-icon',
    instance: false
  }
}
```

---

## Testing

### Test Result Reporting

```javascript
const emojis = require('node-emojis')

class TestReporter {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0
    }
  }

  reportTest(name, status, duration) {
    const statusEmojis = {
      passed: emojis.white_check_mark,
      failed: emojis.x,
      skipped: emojis.fast_forward
    }

    console.log(
      `${statusEmojis[status]} ${name} (${duration}ms)`
    )

    this.results[status]++
  }

  summary() {
    const total = Object.values(this.results).reduce((a, b) => a + b, 0)
    const success = this.results.passed === total
    
    console.log('\n' + '='.repeat(50))
    console.log(
      `${success ? emojis.trophy : emojis.warning} Test Summary:`
    )
    console.log(`${emojis.white_check_mark} Passed: ${this.results.passed}`)
    console.log(`${emojis.x} Failed: ${this.results.failed}`)
    console.log(`${emojis.fast_forward} Skipped: ${this.results.skipped}`)
    console.log(`${emojis.bar_chart} Total: ${total}`)
  }
}
```

---

## Advanced Patterns

### Emoji-Based State Machine

```javascript
const emojis = require('node-emojis')

class TaskStateMachine {
  constructor() {
    this.states = {
      pending: { emoji: emojis.hourglass, next: ['in_progress', 'cancelled'] },
      in_progress: { emoji: emojis.gear, next: ['completed', 'failed', 'paused'] },
      paused: { emoji: emojis.pause_button, next: ['in_progress', 'cancelled'] },
      completed: { emoji: emojis.white_check_mark, next: [] },
      failed: { emoji: emojis.x, next: ['pending'] },
      cancelled: { emoji: emojis.no_entry, next: [] }
    }
    
    this.currentState = 'pending'
  }

  transition(newState) {
    const current = this.states[this.currentState]
    
    if (!current.next.includes(newState)) {
      throw new Error(`Cannot transition from ${this.currentState} to ${newState}`)
    }
    
    console.log(
      `${current.emoji} ${this.currentState} → ${this.states[newState].emoji} ${newState}`
    )
    
    this.currentState = newState
  }

  getStatus() {
    const state = this.states[this.currentState]
    return `${state.emoji} ${this.currentState}`
  }
}
```

### Dynamic Emoji Loading

```javascript
const emojis = require('node-emojis')
const { getByCategory } = require('node-emojis/search')

class EmojiManager {
  constructor() {
    this.cache = new Map()
  }

  async loadCategory(category) {
    if (this.cache.has(category)) {
      return this.cache.get(category)
    }

    console.log(`${emojis.package} Loading ${category} emojis...`)
    
    const categoryEmojis = getByCategory(category)
    this.cache.set(category, categoryEmojis)
    
    console.log(
      `${emojis.white_check_mark} Loaded ${categoryEmojis.length} ${category} emojis`
    )
    
    return categoryEmojis
  }

  getRandomEmoji(category) {
    const emojis = this.cache.get(category) || []
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  preload(categories) {
    return Promise.all(
      categories.map(category => this.loadCategory(category))
    )
  }
}
```

### Custom Emoji Formatter

```javascript
const emojis = require('node-emojis')
const { applySkinTone } = require('node-emojis/skin-tones')

class EmojiFormatter {
  constructor(options = {}) {
    this.skinTone = options.skinTone || 'default'
    this.fallback = options.fallback || '❓'
  }

  format(template, data = {}) {
    return template.replace(/:(\w+):/g, (match, name) => {
      return this.getEmoji(name) || match
    })
  }

  getEmoji(name) {
    let emoji = emojis[name]
    
    if (!emoji) {
      return this.fallback
    }

    if (this.skinTone !== 'default') {
      const { supportsSkinTone } = require('node-emojis/skin-tones')
      if (supportsSkinTone(name)) {
        emoji = applySkinTone(emoji, this.skinTone)
      }
    }

    return emoji
  }

  batch(templates, data = {}) {
    return templates.map(template => this.format(template, data))
  }
}

// Usage
const formatter = new EmojiFormatter({ skinTone: 'medium' })

const messages = [
  'Hello :wave:! Welcome to our app :tada:',
  'Build status: :white_check_mark: Success',
  'Have a great day :sun_with_face:!'
]

formatter.batch(messages).forEach(message => {
  console.log(message)
})
```

---

Need more examples? Check out our [GitHub repository](https://github.com/jesselpalmer/node-emojis) or [open a discussion](https://github.com/jesselpalmer/node-emojis/discussions) to request specific use cases!

---

*Last updated: July 2025 | Version: 1.0.0*