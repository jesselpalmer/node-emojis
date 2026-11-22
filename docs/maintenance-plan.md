# Maintenance plan

Audit date: 2026-11-22. Goal: a stable, correct, low-maintenance `node-emojis`
that keeps working for existing consumers. Feature growth is out of scope.

## Current status

| Area | Finding |
| ---- | ------- |
| Release | npm `1.0.0` (2025-07-05). Packing `main` produces a tarball byte-identical to the published one (same shasum), so `main` is what users have. |
| Open issues | #23 only. |
| Open PRs | #20 (minimatch), #21 (picomatch), #22 (fast-uri): Dependabot security bumps, lockfile-only, all transitive dev dependencies. |
| Runtime dependencies | None. `npm audit --omit=dev` reports 0 vulnerabilities. Consumers are not exposed to any of the advisories below. |
| Dev dependencies | `npm audit` reports 21 advisories (10 high), all in dev tooling. `npm audit fix` (no major bumps) clears most of them; the rest need `mocha` 12, `nyc` 18 and a newer `markdownlint-cli2`. Dependabot cannot open PRs for `uuid` and `serialize-javascript` because they need those major bumps. |
| Tests | 191 passing, coverage 92.5% lines. Tests run against `src/` via ts-node, so they never exercise the built package or the `module.exports` override. That is how #23 shipped. |
| CI | One workflow, Node 20.x and 22.x. Node 20 reached end of life in April 2026; current LTS lines are 22, 24 and 26. Uses `codecov-action@v3` (outdated). |
| Release process | Manual `npm publish` (`prepublishOnly` builds and tests). CHANGELOG claims "auto-publishing to npm on tagged releases", but no such workflow exists. |

## Confirmed problems

Each was reproduced against the packed tarball installed into a clean project.

1. **#23: root named exports are missing at runtime (P0).**
   `src/index.ts` ends with `module.exports = emojis`, which discards the
   `export * from ...` re-exports TypeScript generated.
   - CommonJS: `require('node-emojis').search`, `filterByCategory`,
     `filterByVersion`, `filterByKeyword`, `getNameFromEmoji`, `isValidEmoji`
     and `isValidEmojiName` are `undefined`. Some others (`getByCategory`,
     `applySkinTone`, `getAliases` ...) work only because the legacy object
     happens to define them.
   - Native ESM: `import { search } from 'node-emojis'` throws
     `SyntaxError: Named export 'search' not found`. The namespace has only
     `default`.
   - TypeScript: `index.d.ts` declares these named exports, so code compiles
     and then fails at runtime.
   - The README's "Utilities" example (`getNameFromEmoji` from
     `node-emojis`) is one of the broken cases.
   - Unaffected: `require('node-emojis').fire`, the default import, and every
     subpath import (`node-emojis/search`, `/skin-tones`, `/aliases`,
     `/filters`, and the category subpaths).
2. **TypeScript ESM default import is mistyped (P1).** In a `"type": "module"`
   project using `moduleResolution: nodenext`, `import emojis from 'node-emojis'`
   works at runtime, but `emojis.fire` fails type-checking.
3. **Published `.d.ts` files import JSON (P1).** For example,
   `lib/features/filters/index.d.ts` contains
   `import categories from '../../data/categories.json'`. Consumers without
   `skipLibCheck` (or `resolveJsonModule`) get type errors. Subpath types also
   do not resolve under the legacy `moduleResolution: node`, which is expected
   for an `exports`-map package and only needs documenting.
4. **Documentation drift (P2).** The README says "Node.js and browsers" and
   "tree-shakeable ES modules", but the build is CommonJS only. The CHANGELOG
   mentions auto-publishing that does not exist. `examples/modern-usage.js`
   shows `import { emojis, metadata } from 'node-emojis'`, but there is no
   `emojis` named export.
5. **Repo hygiene (P2).** `lib/index.js` is committed even though `lib/` is
   gitignored (it currently matches the build output).

## Prioritized work

### P0: correctness and security

- **Fix #23.** Keep `module.exports = emojis` so `require('node-emojis').fire`
  and `Object.keys(require('node-emojis'))` behave exactly as now. Attach the
  documented named exports to that object as **non-enumerable** properties,
  using `module.exports.<name> = ...` assignments that Node's CommonJS export
  detection recognizes. This makes ESM named imports work without a second
  entry file. Check for collisions between export names and emoji names
  first. Fall back to a small hand-written `lib/index.mjs` wrapper only if
  static detection proves unreliable.
- **Consumer smoke tests.** Add a script that runs `npm pack`, installs the
  tarball into temp CJS, ESM and TypeScript (`nodenext`) projects, and checks
  the documented import paths. Run it in CI, so the published artifact is
  tested rather than `src/`.
- **Security bumps.** Supersede #20 to #22 with one lockfile refresh
  (`npm audit fix`, no major bumps), and verify that tests and lint still
  pass. Dependabot closes its PRs once the lockfile no longer needs them.

### P1: package and tooling health

- Fix the TypeScript ESM default-import typing, and stop shipping `.d.ts`
  files that import JSON (type the data inline or via `typeof` on a `.ts`
  module).
- Upgrade the remaining dev tooling majors (`mocha`, `nyc`,
  `markdownlint-cli2`) to clear the rest of `npm audit`, one PR, only if the
  tests stay green with no config churn.
- Set the CI matrix to 20 (engine floor), 22, 24 and 26. Update
  `codecov-action` or drop it if no one uses the reports.
- Add `.github/dependabot.yml` with grouped, monthly updates for npm and
  GitHub Actions, so security PRs do not pile up.

### P2: maintenance improvements

- Correct the README, CHANGELOG and example claims listed above.
- Update SECURITY.md and the README "Requirements" to name the Node versions
  CI actually tests.
- Document the release steps in CONTRIBUTING.md (version bump, CHANGELOG,
  `npm pack` check, `npm publish`, tag).
- Untrack `lib/index.js`.
- Consider removing `scripts/check-bypass.js` and its CI step. It flags
  commit messages containing words like "wip", adds no protection, and is
  maintenance overhead. Only with your approval.

## Breaking-change risks

- Any change to the root object must keep `Object.keys(emojis)` and
  `for...in` returning only emoji names. Named exports therefore go on as
  non-enumerable properties.
- If an export name equals an emoji name, the emoji value must win, because
  that is the legacy behavior.
- `engines` stays `>=20`. Raising it is a breaking change and is not needed.
- Adding an ESM wrapper (fallback only) could introduce a dual-package
  hazard. The preferred fix avoids a second module instance.

## Test strategy

- Keep the existing unit tests.
- Add regression tests for #23 that load the **built** `lib/index.js`, not
  `src/`.
- Add the packed-tarball smoke test (CJS, ESM, TypeScript `nodenext`
  CJS and ESM), and run it in CI on every Node version in the matrix.
- Before release, run the smoke test against the exact tarball that will be
  published.

## Release strategy

- Ship as **1.0.1** (patch): it fixes documented behavior and adds no API.
- Steps: merge fixes, update CHANGELOG, bump the version, `npm pack` and run
  the smoke test on that tarball, then publish manually after explicit
  approval, then tag `v1.0.1` and create a GitHub release.
- No automated publishing. It would need npm credentials in CI and adds
  little for a package released this rarely.

## Non-goals

- Adding emojis or refreshing the emoji data set.
- New APIs, a redesign, native dual ESM/CJS builds, browser bundles, a demo
  site, or community growth work.
- Raising the minimum Node version.

## Progress (2026-11-22)

- Done: #23 fixed with built-package regression tests and a packed-tarball
  smoke test in CI (#25); lockfile security refresh superseding #20 to #22
  (#26); CI on Node 20/22/24/26, dev tooling majors, Dependabot config,
  Codecov removed (#27); documentation and release-process corrections.
- Deferred, documented rather than fixed (low impact, would add
  maintenance surface):
  - TypeScript with `"type": "module"` and `moduleResolution: nodenext`
    types the default import as the module namespace, so `emojis.fire`
    fails type-checking although it works at runtime. Fixing it needs a
    hand-maintained `.d.mts`.
  - Published `.d.ts` files import JSON, which only matters to consumers
    who turn off `skipLibCheck`.
  - `getNameFromEmoji` returns the last alias registered for an emoji
    (`snapstreak` for 🔥) rather than the primary name. Changing it alters
    output, so it belongs in a minor release if at all.
  - `actions/checkout` and `actions/setup-node` v4 run on the deprecated
    Node 20 Actions runtime; the new Dependabot config will propose
    upgrades.

## Remaining work and blockers

- Publishing needs the maintainer's npm access and explicit approval.
- Every PR is reviewed and merged by the maintainer.
- Ideas deferred beyond this pass: a real ESM build, refreshing emoji data to
  a newer Unicode version, and slimming the dev tooling (husky, commitlint,
  yaml-lint).
