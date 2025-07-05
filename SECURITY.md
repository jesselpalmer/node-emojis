# Security Policy

## Supported Versions

The following versions of node-emojis are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of node-emojis seriously. If you have discovered a security vulnerability in this project, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email the details to <jesselpalmer@gmail.com> with:
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Any suggested fixes (if applicable)

### What to Expect

- **Acknowledgment**: You will receive an acknowledgment of your report within 48 hours
- **Initial Assessment**: Within 7 days, we will provide an initial assessment of the vulnerability
- **Updates**: We will keep you informed about the progress of addressing the vulnerability
- **Resolution**: Once fixed, we will:
  - Release a security patch
  - Publish a security advisory on GitHub
  - Credit you for the discovery (unless you prefer to remain anonymous)

### Security Update Process

1. Security patches will be released as soon as possible
2. All supported versions will receive security updates
3. Users will be notified through:
   - GitHub Security Advisories
   - npm security advisories
   - Release notes

## Security Best Practices

While node-emojis is a data library with minimal security surface area, we recommend:

- Keep your dependencies up to date
- Use npm audit regularly to check for vulnerabilities
- Follow the principle of least privilege when using this library
- Validate and sanitize any user input before using it with emoji functions

## Scope

Since node-emojis is primarily a data library without network requests or file system operations, security vulnerabilities are unlikely but could include:

- Malicious data that could cause denial of service
- Regular expression vulnerabilities (ReDoS)
- Memory exhaustion attacks
- Prototype pollution vulnerabilities

Thank you for helping keep node-emojis and its users safe!
