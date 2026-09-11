---
"@medusajs/caching": patch
---

fix(caching): reset the in-memory size accounting when the cache is cleared with the wildcard tag, so the provider does not keep reporting itself as full
