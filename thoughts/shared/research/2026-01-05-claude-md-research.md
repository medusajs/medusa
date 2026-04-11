---
date: 2026-01-05T07:06:33Z
researcher: Claude
git_commit: 43305a562cfba914654da056b0a7e03c40849678
branch: develop
repository: medusa-core
topic: "CLAUDE.md File Creation Research"
tags: [research, codebase, claude-md, documentation, conventions]
status: complete
last_updated: 2026-01-05
last_updated_by: Claude
---

# Research: CLAUDE.md File Creation for Medusa Core

**Date**: 2026-01-05T07:06:33Z
**Researcher**: Claude
**Git Commit**: 43305a562cfba914654da056b0a7e03c40849678
**Branch**: develop
**Repository**: medusa-core

## Research Question

Research the Medusa Core codebase to gather information needed to create a CLAUDE.md file following Claude Code best practices. The file should be concise and focused.

## Summary

This research documents the Medusa Core monorepo structure, build system, testing conventions, and code style to enable creation of an effective CLAUDE.md file. Key findings:

- **Monorepo**: Yarn 3 workspaces with Turbo orchestration
- **Stack**: Node.js 20+, TypeScript 5.6.2, Express, MikroORM/PostgreSQL
- **30+ modules**: Product, Order, Cart, Payment, Fulfillment, etc.
- **Admin**: React 18 dashboard with Vite
- **Testing**: Jest for backend, Vitest for frontend

## Detailed Findings

### 1. Codebase Structure

**Monorepo Organization:**
```
/packages/
├── medusa/              # Main Medusa package
├── core/                # Core framework packages
│   ├── framework/       # Core runtime
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utilities
│   ├── workflows-sdk/   # Workflow composition
│   ├── core-flows/      # Predefined workflows
│   └── modules-sdk/     # Module development
├── modules/             # 30+ commerce modules
│   ├── product/, order/, cart/, payment/...
│   └── providers/       # 15+ provider implementations
├── admin/               # Dashboard packages
│   └── dashboard/       # React admin UI
├── cli/                 # CLI tools
└── design-system/       # UI components
/integration-tests/      # Full-stack tests
/www/                    # Documentation site
```

**Key Directories:**
- `packages/core/framework/` - Core runtime, HTTP, database
- `packages/medusa/src/api/` - API routes
- `packages/modules/` - Commerce feature modules
- `packages/admin/dashboard/` - Admin React app

### 2. Build System & Commands

**Package Manager**: Yarn 3.2.1 with node-modules linker

**Essential Commands:**
```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Build specific package
yarn workspace @medusajs/medusa build

# Watch mode (in package directory)
yarn watch

# Lint
yarn lint

# Format
yarn prettier --write <files>
```

**Testing Commands:**
```bash
# All unit tests
yarn test

# Package integration tests
yarn test:integration:packages

# HTTP integration tests
yarn test:integration:http

# API integration tests
yarn test:integration:api

# Module integration tests
yarn test:integration:modules
```

### 3. Testing Conventions

**Frameworks:**
- Jest 29.7.0 (backend/core)
- Vitest 3.0.5 (admin/frontend)

**Test Locations:**
- Unit tests: `__tests__/` directories alongside source
- Module integration tests: `packages/*/integration-tests/__tests__/`
- HTTP integration tests: `integration-tests/http/__tests__/`

**Test Runners:**
- `medusaIntegrationTestRunner` - HTTP integration tests
- `moduleIntegrationTestRunner` - Module integration tests
- Both from `@medusajs/test-utils`

**Patterns:**
- File extension: `.spec.ts` or `.test.ts`
- Unit test structure: `describe/it` blocks
- Integration tests: Use custom test runners with DB setup

### 4. Code Style Conventions

**Formatting (Prettier):**
- No semicolons
- Double quotes
- 2 space indentation
- ES5 trailing commas
- Always use parens in arrow functions

**TypeScript:**
- Target: ES2021
- Module: Node16
- Strict null checks enabled
- Decorators enabled (experimental)

**Naming Conventions:**
- Files: kebab-case (`define-config.ts`)
- Types/Interfaces/Classes: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- DB fields: snake_case

**Import Organization:**
1. @medusajs/framework imports (grouped by subpath)
2. External npm packages
3. Node.js built-ins
4. Relative local imports

**Export Patterns:**
- Barrel exports via `export * from`
- Named re-exports for specific items

## Code References

- Root package.json: `package.json`
- ESLint config: `.eslintrc.js`
- Prettier config: `.prettierrc`
- TypeScript base: `_tsconfig.base.json`
- Turbo config: `turbo.json`
- Contributing guide: `CONTRIBUTING.md`
- Jest config: `jest.config.js`
- Yarn config: `.yarnrc.yml`

## Recommended CLAUDE.md Structure

Based on research, the CLAUDE.md should include:

1. **Project Overview** - Brief description of Medusa as commerce platform
2. **Quick Commands** - Build, test, lint commands
3. **Code Style** - Key formatting/naming conventions
4. **Architecture Notes** - Module system, workflows, admin
5. **Testing** - How to run tests, test patterns
6. **Key Directories** - Where to find important code

Keep each section to 3-5 bullet points maximum for conciseness.

## Open Questions

None - sufficient information gathered for CLAUDE.md creation.
