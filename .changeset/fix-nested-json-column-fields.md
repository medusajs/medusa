---
"@medusajs/query": patch
---

fix(query): select nested JSON/object column properties instead of dropping them

Requesting a nested property of a JSON/object column via `fields` (e.g. `fields=handle,metadata.test`) dropped the value from the response. The path was resolved as a relation (`metadata` -> column `test`), so the module was asked to populate a non-existent relation and never selected the `metadata` column. Non-relation nested paths on a known entity are now selected as the whole column on the parent entity, restoring access to nested JSON/object properties while leaving real relation paths (e.g. `variants.prices`) untouched.
