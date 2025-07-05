#!/usr/bin/env node
/**
 * Script to detect and warn about pre-commit hook bypasses
 * This can be run in CI to flag commits that bypassed checks
 */

const { execSync } = require('child_process')

// Patterns that might indicate bypassed hooks
const suspiciousPatterns = [
  /no-verify/i,
  /--no-verify/i,
  /skip.*hook/i,
  /skip.*check/i,
  /temp.*commit/i,
  /\bwip\b/i,
  /force.*push/i
]

function checkRecentCommits() {
  try {
    // Get last 5 commits with their messages
    const commits = execSync('git log --oneline -5', { encoding: 'utf8' })
    const commitLines = commits.trim().split('\n')
    
    const suspiciousCommits = []
    
    commitLines.forEach(line => {
      const [hash, ...messageParts] = line.split(' ')
      const message = messageParts.join(' ')
      
      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(message))
      
      if (isSuspicious) {
        suspiciousCommits.push({ hash, message })
      }
    })
    
    if (suspiciousCommits.length > 0) {
      console.log('⚠️  Found potentially bypassed commits:')
      suspiciousCommits.forEach(({ hash, message }) => {
        console.log(`  ${hash}: ${message}`)
      })
      console.log('\n💡 Consider reviewing these commits for quality issues')
    } else {
      console.log('✅ No suspicious commit patterns detected')
    }
    
    return suspiciousCommits.length
  } catch (error) {
    console.error('Error checking commits:', error.message)
    return 1
  }
}

if (require.main === module) {
  const suspiciousCount = checkRecentCommits()
  process.exit(suspiciousCount > 0 ? 1 : 0)
}

module.exports = { checkRecentCommits }