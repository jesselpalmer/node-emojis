# Contributing to the Wiki 📝

Help us improve the node-emojis documentation by contributing to this wiki!

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Wiki Structure](#wiki-structure)
- [Content Guidelines](#content-guidelines)
- [Editing Pages](#editing-pages)
- [Creating New Pages](#creating-new-pages)
- [Content Ideas](#content-ideas)

---

## How to Contribute

There are several ways to contribute to the wiki:

### 1. **Report Issues**

Found outdated information or broken links? [Open an issue](https://github.com/jesselpalmer/node-emojis/issues) with the label `documentation`.

### 2. **Suggest Improvements**

Have ideas for new content or better organization? [Start a discussion](https://github.com/jesselpalmer/node-emojis/discussions).

### 3. **Edit Existing Pages**

See a typo or want to clarify something? Edit the page directly on GitHub.

### 4. **Create New Content**

Want to add a new tutorial or example? Follow our guidelines below.

---

## Wiki Structure

Our wiki is organized into these main sections:

```text
📚 Wiki Structure
├── 🏠 Home.md                    # Welcome page and navigation
├── 🚀 Getting-Started.md         # Installation and basic usage
├── 📖 API-Reference.md           # Complete API documentation
├── ❓ FAQ.md                     # Frequently asked questions
├── 🍳 Recipes-and-Examples.md    # Practical examples and patterns
├── 🔧 Advanced-Usage.md          # Advanced patterns and optimization
├── 📈 Migration-Guide.md         # Upgrading guides
└── 📝 Contributing-to-Wiki.md    # This page
```

### Page Categories

- **Core Documentation**: Essential pages that every user needs
- **Tutorials**: Step-by-step guides for specific tasks
- **Examples**: Real-world usage patterns and recipes
- **Reference**: Detailed API and configuration documentation

---

## Content Guidelines

### Writing Style

- **Clear and Concise**: Use simple language and short sentences
- **Practical**: Focus on actionable information and real examples
- **Beginner-Friendly**: Assume readers are new to the library
- **Up-to-Date**: Ensure all code examples work with the latest version

### Code Examples

✅ **Good Example**:

```javascript
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

// Search for happy emojis
const results = search('happy')
console.log(results[0].emoji) // 😊
```

❌ **Poor Example**:

```javascript
// This won't work in v1.0
const emoji = require('node-emojis')
emoji.get('smile')
```

### Formatting Standards

- Use **emoji headers** for visual appeal: `# Getting Started 🚀`
- Include **table of contents** for longer pages
- Use **code blocks** with language specification
- Add **explanatory comments** in code examples
- Include **"Last updated"** footer with version info

### Required Sections

Every major page should include:

1. **Clear title with emoji**
2. **Table of contents**
3. **Introduction paragraph**
4. **Practical examples**
5. **Related links**
6. **Footer with update info**

---

## Editing Pages

### Quick Edits

For small changes like typos or clarifications:

1. Navigate to the page on GitHub
2. Click the **"Edit"** button (pencil icon)
3. Make your changes
4. Add a clear commit message
5. Create a pull request

### Major Changes

For significant updates:

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a **feature branch**: `git checkout -b docs/improve-api-reference`
4. Make your changes
5. **Test** all code examples
6. **Commit** with descriptive messages
7. **Push** and create a pull request

### Local Development

To work on wiki content locally:

```bash
# Clone the repository
git clone https://github.com/jesselpalmer/node-emojis.git
cd node-emojis

# Create a branch for your changes
git checkout -b docs/your-improvement

# Make changes to wiki files
# Test any code examples you add

# Commit and push
git add .
git commit -m "docs: improve search examples in wiki"
git push origin docs/your-improvement
```

---

## Creating New Pages

### Before Creating

Ask yourself:

- Is this information already covered elsewhere?
- Would this be better as part of an existing page?
- Is this specific to node-emojis or too general?

### Page Structure Template

Use this template for new pages:

```markdown
# Page Title 🎯

Brief description of what this page covers.

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)

---

## Section 1

Content with practical examples...

```javascript
// Code example
const emojis = require('node-emojis')
console.log(emojis.fire) // 🔥
```

### Subsection

More detailed information...

---

## Section 2

Additional content...

---

## Related Pages

- [Getting Started](./Getting-Started)
- [API Reference](./API-Reference)

---

## Template End

Last updated: July 2025 | Version: 1.0.0

### Naming Conventions

- Use **kebab-case** for file names: `advanced-usage.md`
- Use **descriptive names**: `skin-tone-tutorial.md` not `tutorial.md`
- Avoid **special characters** except hyphens
- Keep names **concise** but clear

---

## Review Process

### What We Look For

- **Accuracy**: All code examples work as written
- **Clarity**: Information is easy to understand
- **Completeness**: Examples include necessary imports/setup
- **Consistency**: Follows our style and format guidelines
- **Value**: Adds meaningful information for users

### Review Timeline

- **Quick fixes**: Usually reviewed within 24-48 hours
- **New content**: May take 3-5 days for thorough review
- **Major changes**: Could take up to a week

### Feedback and Revisions

- We'll provide **constructive feedback** on improvements
- Multiple **review rounds** may be needed for major changes
- We're here to **help you succeed** - don't hesitate to ask questions!

---

## Content Ideas

Looking for ways to contribute? Here are some ideas:

### Tutorials Needed

- **Framework Integration**: Detailed guides for React, Vue, Angular
- **Testing**: How to test applications that use node-emojis
- **Performance**: Advanced optimization techniques
- **Accessibility**: Making emojis accessible to screen readers

### Examples Wanted

- **Real-world Applications**: How companies use node-emojis
- **Creative Uses**: Unique ways to incorporate emojis
- **Troubleshooting**: Common problems and solutions
- **Best Practices**: Patterns from experienced users

### Reference Material

- **Emoji Categories**: Detailed lists with descriptions
- **Browser Compatibility**: Emoji support across different browsers
- **Unicode Information**: Technical details about emoji standards

---

## Style Guide

### Emoji Usage

- Use emojis **sparingly** in content (not every sentence)
- **Always** include emojis in section headers
- Use **relevant** emojis that add meaning
- Keep emoji **consistent** within pages

### Code Style

```javascript
// ✅ Good: Clear imports and comments
const emojis = require('node-emojis')
const { search } = require('node-emojis/search')

// Search for food emojis
const foodEmojis = search('food')

// ❌ Avoid: Unclear or outdated examples
const emoji = require('node-emojis')
emoji.get('fire') // This API changed in v1.0
```

### Links and References

- Use **relative links** for wiki pages: `[API Reference](./API-Reference)`
- Use **absolute URLs** for external links
- Always **test links** before submitting
- Include **meaningful link text** (not "click here")

---

## Recognition

Contributors to the wiki will be:

- **Credited** in our README
- **Mentioned** in release notes (for significant contributions)
- **Invited** to join our contributors team
- **Featured** in our community showcase

---

## Questions?

Need help contributing? Here's how to get support:

- 💬 [Start a discussion](https://github.com/jesselpalmer/node-emojis/discussions)
- 📧 Email us at [jesselpalmer@gmail.com](mailto:jesselpalmer@gmail.com)
- 🐛 [Open an issue](https://github.com/jesselpalmer/node-emojis/issues) for documentation bugs

---

**Thank you for helping make node-emojis documentation better for everyone!** 🙏

---

Last updated: July 2025 | Version: 1.0.0
