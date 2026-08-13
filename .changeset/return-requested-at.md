---
"@medusajs/order": patch
"@medusajs/core-flows": patch
---

Persist `requested_at` when a return is created directly (storefront `POST /store/returns`); the admin previously displayed 01/01/1970.
