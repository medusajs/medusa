---
"@medusajs/medusa": patch
"@medusajs/search": patch
"@medusajs/types": patch
"@medusajs/utils": patch
---

Remove the in-memory local search provider. Indexes are created only by `db:migrate`, never at application start.
