# Contributing to node-emojis

First off, thank you for considering contributing to node-emojis! It's people like you that make node-emojis such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include code samples and error messages if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/node-emojis.git
   cd node-emojis
   ```

2. Install dependencies (Node.js 20 or later; the `.nvmrc` pins 24):

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Run tests:

   ```bash
   npm test
   ```

5. Run linting:

   ```bash
   npm run lint
   ```

## Development Workflow

### Project Structure

```text
node-emojis/
├── src/                    # TypeScript source files
│   ├── index.ts           # Main entry point
│   ├── categories/        # Category-specific exports
│   ├── core/              # Core type definitions
│   ├── data/              # JSON data files
│   ├── features/          # Feature modules
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── test/                  # Test files
├── examples/              # Example usage files
└── scripts/               # Development scripts
```

### Available Scripts

- `npm run build` - Build the TypeScript files
- `npm test` - Run all tests with coverage
- `npm run lint` - Run the TypeScript and Markdown linters
- `npm run lint:fix` - Auto-fix linting issues where possible
- `npm run clean` - Clean build outputs

### Testing

- We use Mocha and Chai for testing
- Tests are written in TypeScript
- Aim for high test coverage (minimum threshold: 85%)
- Run tests before submitting PRs

### Code Style

- TypeScript is configured with strict mode
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This leads to more readable messages that are easy to follow when looking through the project history.

#### Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, missing semicolons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

#### Examples

```bash
# Feature
feat: add skin tone support for human emojis

# Bug fix
fix: correct emoji lookup for aliases

# Documentation
docs: update README with tree-shaking examples

# Breaking change
feat!: migrate to ES modules

BREAKING CHANGE: The package now uses ES modules. 
CommonJS is still supported via backward compatibility layer.

# Commit with scope
feat(search): add fuzzy search capability

# Commit with issue reference
fix: resolve duplicate emoji entries

Fixes #123
```

#### Guidelines

- Keep the subject line under 50 characters
- Use the imperative mood ("add" not "added" or "adds")
- Don't capitalize the first letter
- Don't end with a period
- Reference issues and PRs in the footer when applicable

### Adding New Emojis

1. Update `src/data/emojis.json` with the emoji mapping
2. Update `src/data/metadata.json` with emoji metadata
3. Update `src/data/categories.json` if adding to a category
4. Add tests for the new emoji
5. Run `npm test` to ensure everything works

### Checks

There are no git hooks. Before opening a PR, run:

```bash
npm run lint && npm test
```

CI runs the same checks, plus the packed-package smoke test, on every
supported Node.js version.

## Release Process

Releases are published manually by maintainers. To release a new version:

1. Make sure CI is green on `main`, then work from a clean checkout:
   `git checkout main && git pull && npm ci`
2. Bump the version without tagging yet: `npm version patch --no-git-tag-version`
   (use `minor` or `major` as semver requires)
3. Move the `Unreleased` CHANGELOG entries under the new version and date
4. Build and verify the exact artifact:
   `npm test && npm run test:package && npm pack --dry-run` (`npm test`
   builds `lib/` first)
   Check that the file list contains only `lib/`, `README.md`, `LICENSE`
   and `package.json`
5. Open a PR with the version bump and CHANGELOG, and merge it once CI passes
6. From the merged `main`: `npm publish` (`prepublishOnly` runs `npm test`,
   which rebuilds and reruns the tests). Requires npm publish rights and 2FA
7. Tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`
8. Create a GitHub release from the tag with the CHANGELOG notes

There is no automated publishing; releases are rare and manual on purpose.

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
