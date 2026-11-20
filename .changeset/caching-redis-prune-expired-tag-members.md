---
"@medusajs/caching-redis": patch
---

fix(caching-redis): remove expired entries from tag sets when a tag is cleared, so tag sets stop growing and clears stop re-processing dead keys
