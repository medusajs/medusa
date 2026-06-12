# testing-standards.md

**Last updated:** 2026-06-11

## Test Framework

| Framework | Version  | Used for                                      | Config location                                               |
|-----------|----------|-----------------------------------------------|---------------------------------------------------------------|
| Jest      | 29.7.0   | Backend — all packages under `packages/`      | Root `jest.config.js`; per-package `jest.config.js` files    |
| Vitest    | 3.0.5    | Admin dashboard (`packages/admin/dashboard/`) | `packages/admin/dashboard/package.json` (`test` script)      |

**Jest transformer:** `@swc/jest` `^0.2.36` — SWC-based TypeScript transform for faster Jest execution.

Source: root `package.json` devDependencies; `packages/admin/dashboard/package.json`

---

## Test File Location Pattern

Tests are **co-located** with source files inside a `__tests__/` subdirectory adjacent to the source file's directory:

```
packages/core/utils/src/common/
├── deep-copy.ts
└── __tests__/
    └── deep-copy.spec.ts
```

Integration tests are separated into their own top-level directories:

```
integration-tests/
├── api/                   # Full API integration tests (Jest)
├── http/__tests__/        # HTTP layer integration tests (Jest)
└── modules/__tests__/     # Module-level integration tests (Jest)
```

Each module package also has its own integration tests:

```
packages/modules/auth/integration-tests/__tests__/
packages/modules/*/integration-tests/__tests__/
```

Source: `packages/core/utils/src/common/__tests__/deep-copy.spec.ts`; `integration-tests/` tree; `packages/modules/auth/integration-tests/`

---

## Test Naming Convention

- **File suffix:** `.spec.ts` (primary pattern) or `.test.ts`
- **Directory:** `__tests__/` co-located with the module under test, or `integration-tests/__tests__/` for integration suites
- **Test structure:** `describe` / `it` blocks following Jest conventions

Example from `packages/core/utils/src/common/__tests__/deep-copy.spec.ts`:
```typescript
class TestA {
  prop1: any
  prop2: any
  constructor(prop1: any, prop2: any) { ... }
}
const factory = // test data factory inline
```

---

## Test Structure Pattern

Tests follow the **Arrange-Act-Assert (AAA)** pattern observed in unit tests. Integration tests use `describe` blocks grouped by feature or endpoint, with `it` / `test` cases for individual scenarios.

For integration tests that require a running server, the `TestRunnerConfig` interface in `packages/medusa-test-utils/src/medusa-test-runner.ts` exposes:

```typescript
interface TestRunnerConfig {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  medusaConfigFile?: string
  disableAutoTeardown?: boolean
  schema?: string
  debug?: boolean
  inApp?: boolean
  hooks?: {
    beforeServerStart?: (container: MedusaContainer) => Promise<void>
  }
  cwd?: string
}
```

Source: `packages/medusa-test-utils/src/medusa-test-runner.ts:46`

---

## Mocking Strategy

- **Jest mocks:** `jest.fn()` and `jest.mock()` used in unit tests
- **Mock files:** `__mocks__/` directories alongside source — Jest convention; excluded from published dist via `package.json` `files`
- **Fixture files:** `__fixtures__/` directories hold test fixture data and fixture modules
  - Example: `integration-tests/http/__fixtures__/` — full fixture app configs
  - Example: `packages/core/framework/src/http/__fixtures__/` — middleware fixtures, mock functions
- **Module fixtures:** Complete fixture module implementations used for integration testing
  - `integration-tests/http/__fixtures__/feature-flag/src/modules/custom/services/module-service.ts` — a fixture `ModuleService` implementing `IModuleService`
  - `packages/modules/auth/integration-tests/__fixtures__/providers/default-provider.ts` — fixture auth provider with `authenticate` method

Source: `packages/core/framework/src/http/__fixtures__/routers-middleware/middlewares.ts`; `packages/medusa-test-utils/src/medusa-test-runner.ts`

---

## Fixture & Factory Patterns

### Test Helper Utilities

`packages/medusa-test-utils/` provides the main test harness:
- `MedusaTestRunner` / `TestRunnerConfig` — full server bootstrap for integration tests; manages DB setup, teardown, and lifecycle hooks
- `doWaitSubscribersExecution` (from `packages/medusa-test-utils/src/events.ts`) — waits for event bus subscribers to complete, used for async integration assertions

### Integration Test Helpers

`integration-tests/helpers/` provides shared setup utilities:
- `create-admin-user.ts` — creates an admin user and returns an API token (9 symbols)
- `fixtures.ts` — shared fixture data (4 symbols)
- `retry.ts` — retry helper for flaky async checks (3 symbols)
- `seed-storefront-defaults.ts` — seeds storefront defaults (5 symbols)
- `wait-for-index.ts` — waits for search index synchronization (3 symbols)

### Server Bootstrap (integration-tests)

`integration-tests/environment-helpers/`:
- `bootstrap-app.js` — bootstraps a full Medusa server instance
- `setup-server.js` — server setup entry
- `use-api.js` — wraps HTTP calls for tests
- `use-container.js` — accesses the Awilix DI container in tests
- `test-server.js` / `use-server.js` — manages test server lifecycle

Source: `packages/medusa-test-utils/src/medusa-test-runner.ts`; `integration-tests/helpers/`; `integration-tests/environment-helpers/`

---

## Coverage Configuration

Coverage collection is configured in the root `jest.config.js`:

```javascript
collectCoverageFrom: coverageDirs  // packages/*/src/**/*.js
```

Coverage is only collected when `process.env.GENERATE_JEST_REPORT` is set.

No explicit coverage threshold values were found in the codebase.

Source: `jest.config.js`

---

## Test Categories Found

| Category              | Location                                              | Framework | Notes                                                  |
|-----------------------|-------------------------------------------------------|-----------|--------------------------------------------------------|
| Unit tests            | `packages/*/src/**/__tests__/*.spec.ts`               | Jest      | Co-located with source; fast, no DB required           |
| Package integration   | `packages/*/integration-tests/__tests__/`             | Jest      | Per-module DB-level integration tests                  |
| HTTP integration      | `integration-tests/http/__tests__/`                   | Jest      | Full HTTP layer tests with running server              |
| API integration       | `integration-tests/api/src/`                          | Jest      | End-to-end API tests                                   |
| Module integration    | `integration-tests/modules/__tests__/`                | Jest      | Cross-module integration tests                         |
| Dashboard unit tests  | `packages/admin/dashboard/` (vitest)                  | Vitest    | React component tests                                  |

CI jobs for each category are configured in `.github/workflows/` (e.g., `test-cli-with-database.yml`).
