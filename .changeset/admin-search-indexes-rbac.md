---
"@medusajs/medusa": patch
"@medusajs/types": patch
"@medusajs/dashboard": patch
---

fix(medusa,types,dashboard): guard admin-wide operations with dedicated RBAC policies instead of `*:*`, and require `search_index:read` to list search indexes
