---
"@medusajs/medusa": patch
---

fix(medusa): run stale search index cleanup on an all-noop migration plan, so `db:migrate:search` (and `db:migrate`) no longer skip retired index version cleanup when the migration plan has nothing to create, migrate, or drop
