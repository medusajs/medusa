---
"@medusajs/locking": patch
"@medusajs/locking-redis": patch
"@medusajs/locking-postgres": patch
---

fix(locking): rollback acquired keys on multi-key acquisition failure to prevent leftover locks and deadlocks
