---
"@medusajs/framework": patch
---

fix(framework): keep `unlessPath` deterministic with global or sticky expressions

`unlessPath` called `test()` on the caller's `RegExp` for every request. A global or sticky expression advances `lastIndex` on a successful match, so consecutive requests to the same path alternated between skipping and running the middleware. It now matches against a per-instance copy that is reset on each request, leaving the caller's expression untouched.
