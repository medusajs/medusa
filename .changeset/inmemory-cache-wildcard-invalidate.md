---
"@medusajs/cache-inmemory": patch
---

fix(cache-inmemory): treat a wildcard key as a whole-key glob when invalidating, so characters that are meaningful to a regular expression are matched literally
