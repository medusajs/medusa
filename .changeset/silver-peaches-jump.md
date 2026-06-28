---
"@medusajs/dashboard": patch
---

feat: Implement multi select and bulk delete for entities

- Add row selection and bulk delete command to Products, Categories, Collections, Tags, Product Options, and Product Variants.
- Update table actions to handle 404s gracefully on bulk delete.
- Improve bulk delete success and confirmation messages with proper translations and fallback text.
