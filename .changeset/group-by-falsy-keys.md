---
"@medusajs/utils": patch
---

fix(utils): group items whose group key is a falsy but valid value

`groupBy` guarded its key check with `if (!key)`, so an item whose group key resolved to `0` or an empty string was dropped instead of grouped. The check is now `key === null || key === undefined`, so falsy but valid keys group as expected while `null` and `undefined` keys are still skipped.
