---
"@medusajs/utils": patch
"@medusajs/types": patch
---

feat(utils): support dynamic password function in createPgConnection for RDS IAM auth

Pass `driverOptions.dynamicPassword` and `driverOptions.expirationChecker` through to the Knex connection config, enabling AWS RDS IAM authentication and other rotating-credential patterns.
