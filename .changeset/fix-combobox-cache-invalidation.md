---
"@medusajs/dashboard": patch
---

fix(dashboard): fix cache invalidation for combobox queries in product organization form

Change mutation hooks (tags, product types, collections) to invalidate using `.all` instead of `.lists()` so that combobox infinite queries (which use `"_cbx_"` key segment) are properly invalidated after create/update/delete operations. Also align combobox queryKey values with their API hook factory keys.
