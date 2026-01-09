# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-01-09

### Added
- Initial public release
- Platform-agnostic TypeScript authentication library
- Core authentication types and interfaces (`AuthUser`, `AuthSession`, `AuthProvider`)
- Password validation and hashing utilities
- Environment detection for Node.js, Deno, and Bun
- Auth provider interface for backend implementations
- Error handling utilities with standardized auth errors
- Security-focused utilities for token generation and validation

### Changed
- Updated license to PolyForm Shield License 1.0.0
- Published to npm as public package

[Unreleased]: https://github.com/qwickapps/auth/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/qwickapps/auth/releases/tag/v1.0.0
