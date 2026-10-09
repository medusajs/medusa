---
"@medusajs/dashboard": patch
---

fix(dashboard): remove stale keys from the Persian translation

The Persian (`fa`) translation file contained 18 keys that are not in
`en.json`: 15 camelCase `app.search.groups.*` names that were renamed
to snake_case, and three tax keys (`taxRegions.create.errors.rateIsRequired`,
`taxRegions.create.errors.nameIsRequired`, `taxes.taxRate.editTaxRate`)
that were removed from `en.json`. i18next could never reach them, and the
translation schema rejects additional properties, so
`yarn i18n:validate fa.json` failed.

No Persian value is modified and no keys are added.
