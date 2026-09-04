---
"@medusajs/utils": patch
---

Fix `groupBy` silently dropping items whose group key is a falsy but valid value such as `0` or an empty string. Only `null` and `undefined` keys are skipped now.
