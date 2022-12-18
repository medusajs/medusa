---
"@medusajs/medusa": patch
---

Fixes a bug where using the q param with the endpoint /admin/price-lists/:id/products would also return products not associated with the price list.
