---
"@medusajs/rbac": patch
---

fix(rbac): add migration that creates the missing `rbac_role_inheritance` table

The `RbacRoleInheritance` model is registered by the module but no migration created the corresponding `rbac_role_inheritance` table or its foreign keys, so running `medusa db:migrate` left the module in a broken state and subsequent `medusa db:generate rbac` runs would produce migration files inside `node_modules` (and fail to load under Node's native TS stripping).
