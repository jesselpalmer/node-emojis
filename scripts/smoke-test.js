#!/usr/bin/env node
/**
 * Packed-artifact smoke test.
 *
 * Runs `npm pack`, installs the tarball into throwaway CommonJS, native ESM
 * and TypeScript projects, and checks the documented import paths. This tests
 * exactly what would be published, not the source tree.
 *
 * Usage: npm run build && npm run test:package
 */

const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const tsc = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run (cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    // npm.cmd can only be spawned through a shell on Windows
    shell: process.platform === 'win32'
  })
}

function write (dir, file, contents) {
  fs.writeFileSync(path.join(dir, file), contents)
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'node-emojis-smoke-'))

try {
  const tarball = run(npm, ['pack', '--silent', '--pack-destination', workDir], repoRoot)
    .trim()
    .split('\n')
    .pop()
  const tarballPath = path.join(workDir, tarball)

  function makeProject (name, type) {
    const dir = path.join(workDir, name)
    fs.mkdirSync(dir)
    write(dir, 'package.json', JSON.stringify({ name, private: true, type }))
    run(npm, ['install', '--silent', '--no-audit', '--no-fund', tarballPath], dir)
    return dir
  }

  // Shared assertions, written once and run from each consumer style.
  const jsAssert = "function assert (cond, msg) { if (!cond) throw new Error('smoke test failed: ' + msg) }"
  const checks = `
    assert(emojis.fire === '🔥', 'legacy property access (emojis.fire)')
    assert(typeof search === 'function', 'root named export: search')
    assert(search('fire').length > 0, 'search() returns results')
    assert(typeof getNameFromEmoji === 'function', 'root named export: getNameFromEmoji')
    assert(typeof filterByCategory === 'function', 'root named export: filterByCategory')
    assert(isValidEmoji('🔥') === true, 'root named export: isValidEmoji')
    assert(typeof subSearch === 'function', "subpath: node-emojis/search")
    assert(applySkinTone('👋', 'medium') === '👋🏽', "subpath: node-emojis/skin-tones")
    assert(typeof getAliases === 'function', "subpath: node-emojis/aliases")
    assert(typeof filterByVersion === 'function', "subpath: node-emojis/filters")
    assert(animals.dog !== undefined, "subpath: node-emojis/animals")
  `

  // 1. CommonJS
  const cjsDir = makeProject('cjs-consumer', 'commonjs')
  write(cjsDir, 'index.js', `
    const emojis = require('node-emojis')
    const { search, getNameFromEmoji, filterByCategory, isValidEmoji } = require('node-emojis')
    const { search: subSearch } = require('node-emojis/search')
    const { applySkinTone } = require('node-emojis/skin-tones')
    const { getAliases } = require('node-emojis/aliases')
    const { filterByVersion } = require('node-emojis/filters')
    const animals = require('node-emojis/animals')
    ${jsAssert}
    ${checks}
    console.log('CommonJS consumer: ok')
  `)
  process.stdout.write(run('node', ['index.js'], cjsDir))

  // 2. Native ESM
  const esmDir = makeProject('esm-consumer', 'module')
  write(esmDir, 'index.js', `
    import emojis, { search, getNameFromEmoji, filterByCategory, isValidEmoji } from 'node-emojis'
    import { search as subSearch } from 'node-emojis/search'
    import { applySkinTone } from 'node-emojis/skin-tones'
    import { getAliases } from 'node-emojis/aliases'
    import { filterByVersion } from 'node-emojis/filters'
    import animals from 'node-emojis/animals'
    ${jsAssert}
    ${checks}
    console.log('ESM consumer: ok')
  `)
  process.stdout.write(run('node', ['index.js'], esmDir))

  // 3. TypeScript (CommonJS output, nodenext resolution)
  const tsDir = makeProject('ts-consumer', 'commonjs')
  write(tsDir, 'index.ts', `
    import emojis from 'node-emojis'
    import { search, getNameFromEmoji, filterByCategory, isValidEmoji } from 'node-emojis'
    import { search as subSearch } from 'node-emojis/search'
    import { applySkinTone } from 'node-emojis/skin-tones'
    import { getAliases } from 'node-emojis/aliases'
    import { filterByVersion } from 'node-emojis/filters'
    import animals from 'node-emojis/animals'
    function assert (cond: unknown, msg: string): void {
      if (!cond) throw new Error('smoke test failed: ' + msg)
    }
    ${checks}
    console.log('TypeScript consumer: ok')
  `)
  run(process.execPath, [tsc, '--module', 'nodenext', '--moduleResolution', 'nodenext',
    '--target', 'es2020', '--strict', '--esModuleInterop', '--skipLibCheck', 'index.ts'], tsDir)
  process.stdout.write(run('node', ['index.js'], tsDir))

  console.log(`Smoke test passed for ${tarball}`)
} catch (err) {
  if (err.stdout) process.stdout.write(err.stdout)
  if (err.stderr) process.stderr.write(err.stderr)
  console.error(err.message)
  process.exitCode = 1
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}
