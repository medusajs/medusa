---
"@medusajs/locking": patch
"@medusajs/locking-redis": patch
"@medusajs/types": patch
---

fix(locking, locking-redis): close the Redis client on shutdown and stop connecting eagerly in the loader
