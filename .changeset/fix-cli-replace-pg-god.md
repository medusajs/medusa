---
"@medusajs/cli": patch
---

chore(cli): Replace the unmaintained `pg-god` dependency with a direct `pg.Pool` `CREATE DATABASE` call during `medusa new`, detecting an existing database via the Postgres `42P04` error code.
