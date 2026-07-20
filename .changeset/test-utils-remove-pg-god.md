---
"@medusajs/test-utils": patch
---

fix(test-utils): replace unmaintained pg-god with @medusajs/framework/pg

`@medusajs/test-utils` imported `pg-god` at runtime (in `database.ts` and `jest.ts`) but never declared it as a dependency. It only resolved transitively via `@medusajs/cli`, and #15635 removed `pg-god` from the CLI, so on a clean install every test using `medusaIntegrationTestRunner` failed to load with `Cannot find module 'pg-god'`.

The two `pg-god` helpers used (`createDatabase`/`dropDatabase`) are now reimplemented natively on top of `@medusajs/framework/pg` (already a dependency), reusing the package's existing identifier-quoting and connection-termination logic. This drops the undeclared, unmaintained dependency without changing behavior.
