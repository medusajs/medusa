---
"@medusajs/utils": patch
"@medusajs/types": patch
---

fix(utils): prevent pg from clobbering dynamicPassword function when connectionString is present
types: add dynamicPassword and expirationChecker to databaseDriverOptions interface
