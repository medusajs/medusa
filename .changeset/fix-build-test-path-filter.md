---
"@medusajs/framework": patch
---

fix(framework): use path-segment matching instead of substring check for build file filtering

The build compiler used `String.includes("test")` to exclude test directories, which silently dropped any file containing "test" anywhere in its path (e.g. `reset-test-vendor-password.ts`). Replaced with convention-based path-segment matching that correctly identifies test directories (`test/`, `__tests__/`, `unit-tests/`, etc.) without affecting legitimate source files.
