---
"@medusajs/search": patch
"@medusajs/types": patch
"@medusajs/utils": patch
"@medusajs/medusa": patch
---

Drop the previous search provider's indexes when `db:migrate` switches engines.

Log seed/reindex progress (count, rate, last key) so large catalogs can be followed.
