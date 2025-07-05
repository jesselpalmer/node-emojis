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

2. Install dependencies:

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
- `npm run lint` - Run TypeScript, Markdown, and YAML linters
- `npm run lint:fix` - Auto-fix linting issues where possible
- `npm run clean` - Clean build outputs

### Testing

- We use Mocha and Chai for testing
- Tests are written in TypeScript
- Aim for high test coverage (currently at 85%+)
- Run tests before submitting PRs

### Code Style

- TypeScript is configured with strict mode
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

- Use clear and meaningful commit messages
- Start with a verb in present tense (e.g., "Add", "Fix", "Update")
- Keep the first line under 72 characters
- Reference issues and pull requests where applicable

### Adding New Emojis

1. Update `src/data/emojis.json` with the emoji mapping
2. Update `src/data/metadata.json` with emoji metadata
3. Update `src/data/categories.json` if adding to a category
4. Add tests for the new emoji
5. Run `npm test` to ensure everything works

### Pre-commit Hooks

The project uses pre-commit hooks that run:

- Linting checks
- Test suite

Make sure these pass before committing.

## Release Process

Releases are automated through GitHub Actions when a tag is pushed. Only maintainers can create releases.

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
