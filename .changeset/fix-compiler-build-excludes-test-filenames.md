---
"@medusajs/framework": patch
---

fix(framework): build no longer silently drops source files whose name contains "test"

`medusa build` filtered compiled files using a naive `String.includes()` check
against the ignore list (`integration-tests`, `test`, `unit-tests`, `src/admin`).
Any file whose *path* contained the substring `test` — including user-authored
scripts like `reset-test-vendor-password.ts` or `seed-test-accounts.ts` — was
silently excluded from the build output with no warning.

The filter now compares path *segments* so that only files located inside a
directory named exactly `test/`, `unit-tests/`, or `integration-tests/` are
excluded. Files whose filename happens to contain the word "test" but live
outside those directories are compiled normally.

No user action is required; previously dropped scripts will appear in
`.medusa/server/` after the next build.
