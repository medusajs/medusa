---
"@medusajs/dashboard": patch
"@medusajs/draft-order": patch
---

fix: restore admin form validation under zod v4 by upgrading `@hookform/resolvers` to `^5.2.2` and `react-hook-form` to `^7.55.0`. The `3.x` resolver reads the removed `ZodError.errors` property, so validation errors were silently dropped instead of populating `formState.errors`.
