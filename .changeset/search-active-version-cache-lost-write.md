---
"@medusajs/search": patch
---

fix(search): keep an index's active version when a refresh that started before it was activated lands afterwards, which made reads and writes fail with "has no active version yet" for up to 30 seconds
