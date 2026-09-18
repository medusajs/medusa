---
"@medusajs/utils": patch
"@medusajs/types": patch
---

fix(@medusajs/utils): make dynamicPassword work with connection strings and database migrations

The dynamicPassword option was ignored whenever a database URL was configured: pg overrides the connection password with the parsed URL value, so the function was never called. Connections now resolve the password per pool connection, both for the shared knex connection and for module connections created through MikroORM (including medusa db:migrate). The expirationChecker option is honored on both paths, and the project config types now declare dynamicPassword and expirationChecker.
