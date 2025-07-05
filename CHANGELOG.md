# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-05

### Added

- Full TypeScript support with comprehensive type definitions
- Tree-shakeable ES modules for optimal bundle size
- Modern feature-based architecture with separate imports:
  - `node-emojis/search` - Search functionality
  - `node-emojis/skin-tones` - Skin tone support
  - `node-emojis/aliases` - Alias management
  - `node-emojis/filters` - Filtering utilities
- Markdown linting with markdownlint-cli2
- YAML linting with yaml-lint
- Comprehensive test suite with 170+ tests
- GitHub Actions CI/CD pipeline
- Auto-publishing to npm on tagged releases
- TypeScript configuration for test files
- Organized category imports under `/categories` subdirectory

### Changed

- **BREAKING**: Migrated from single CommonJS export to modular ES modules
- **BREAKING**: Reorganized project structure for better tree-shaking
- **BREAKING**: Some function signatures changed for TypeScript compatibility
- **BREAKING**: Minimum Node.js version requirement updated to 20.0.0
- Improved search algorithm with better scoring
- Enhanced metadata structure with full type safety
- Modernized build toolchain with TypeScript compiler
- Updated all dependencies to latest versions
- Improved documentation with migration guide

### Fixed

- Missing emoji definitions (smiling_face, winking_face, rooster)
- Category getter now returns proper nested objects
- Skin tone constants properly exported
- Search results maintain backward compatibility
- Reverse mapping caching for better performance

### Removed

- Deprecated .travis.yml configuration (replaced with GitHub Actions)
- Old .nycrc configuration (now in package.json)
- Obsolete build scripts

## [0.0.5] - 2019-08-30

### Added

- New emojis

## [0.0.4] - 2019-08-28

### Added

- New emojis

## [0.0.3] - 2019-08-25

### Added

- New emojis

## [0.0.2] - 2019-08-11

### Added

- New emojis

### Fixed

- Broken links

## [0.0.1] - 2019-08-11

### Added

- Initial release of node-emojis

---

For migration instructions from v0.x to v1.0, please see [MIGRATION.md](./MIGRATION.md).
