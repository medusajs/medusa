---
"@medusajs/product": patch
"@medusajs/utils": patch
---

fix: Support non-Latin characters in product handles

- Replace `toHandle()` with `kebabCase()` for product handle generation
- Update `isValidHandle()` to support Unicode letters from any language
- Aligns product behavior with categories and collections
- Closes #14378