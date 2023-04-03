---
"@medusajs/admin-ui": patch
"@medusajs/medusa": patch
"medusa-react": patch
---

feat(medusa, admin-ui, medusa-react): Improvements to product categories
- Adds name as required in category create form
- Adds name and handle as required in category edit form
- Updates message on create/update forms
- Adds category indicators for is_internal and is_active fields in the tree list
- Fixes bug where tree is not reset when update fails
- allow appending all category descendants with a param in list endpoint
- fix rank order changing on category update
- invalidate products query on category delete
- adds category ui for tree/list, edit, create, delete
- add product category queries and mutations
- category list API can return all descendant
- added breadcrumbs for categories on create/edit modal
- add empty state for product categories
- increase tree depth + scope categories on store + allow categories relation in products API
- categories can be ranked based on position
- seed command can create product categories
- hide categories in products behind feature flag
- fixes bug for mpath incorrectly updated for nested categories
