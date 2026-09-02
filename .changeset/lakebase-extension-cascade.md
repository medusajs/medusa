---
"@medusajs/search-postgres": patch
---

Install Lakebase Search extensions during `db:migrate` with `CREATE EXTENSION ... CASCADE`, now that Lakebase no longer requires a preload step.
