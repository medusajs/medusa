---
"@medusajs/locking-redis": patch
---

fix(locking-redis): acquire multi-key locks in a stable deduplicated order, make releaseAll an atomic compare-and-delete, and let a named owner re-enter its own lock under awaitQueue
