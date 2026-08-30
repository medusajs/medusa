---
"@medusajs/dashboard": patch
---

fix(dashboard): fill missing plural forms in Polish translations

The Polish (`pl`) translation file was missing several CLDR plural categories
its own plural-config.json declares, so a count that resolved to a category
the file did not define (e.g. `few` for 2-4 items in `dataGrid.errors.count`)
fell through to the English fallback inside an otherwise Polish screen.

- `dataGrid.errors.count`: add `count_few` and `count_many`. Polish CLDR
  plural rules: 1 -> `one`, 2-4 and 22-24 -> `few`, 5-21 and 25+ -> `many`.
  The file had only `count_one` and `count_other`, so counts of 2, 3, 4,
  22, 23, or 24 rendered in English.
- `orders.fulfillment.error.wrongQuantity`: add `wrongQuantity_one`,
  `wrongQuantity_few`, and `wrongQuantity_many`. The file had only the
  bare `wrongQuantity` (which is itself the `_one` form, "Tylko jeden
  produkt jest dostępny do realizacji") and `wrongQuantity_other`, so
  counts of 2-4 and 5-21/25+ rendered in English.
- Remove the orphan `dataGrid.errors.numberOfKeys_few` and
  `dataGrid.errors.numberOfKeys_many`. The English source of truth
  (`en.json`) does not declare a `dataGrid.errors.numberOfKeys` key, so
  these Polish variants were dead code i18next could never reach. The
  issue's own table identified these as part of Polish's
  `incomplete=3` count even though they were not real missing forms
  and could not be fixed by adding translations.
