---
"@medusajs/rbac": patch
---

fix(rbac): replace upsert with retrieve-then-create in initial-data loader to prevent duplicate key errors on subsequent app starts
