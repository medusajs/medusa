---
"@medusajs/framework": patch
---

fix(framework): match build ignore list against path segments instead of substrings

`medusa build` no longer silently drops user files whose name merely contains an
ignored substring (e.g. `src/scripts/seed-test-accounts.ts`). The build ignore
list (`integration-tests`, `test`, `unit-tests`, `src/admin`) is now matched
against path segments rather than via `String.includes`.
