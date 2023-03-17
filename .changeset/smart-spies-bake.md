---
"@medusajs/admin-ui": patch
"@medusajs/medusa": patch
---

feat(medusa, admin-ui): Improvements to product categories
- Adds name as required in category create form
- Adds name and handle as required in category edit form
- Updates message on create/update forms
- Adds category indicators for is_internal and is_active fields in the tree list
- Fixes bug where tree is not reset when update fails
