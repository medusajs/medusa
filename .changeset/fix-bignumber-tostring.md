---
"@medusajs/utils": patch
---

fix(utils): add `BigNumber.toString()` to avoid `"[object Object]"` coercion

`BigNumber` implemented `valueOf`, `toJSON`, and `[Symbol.toPrimitive]` but not `toString()`, so an explicit `bn.toString()` fell through to `Object.prototype.toString` and returned `"[object Object]"`. This silently broke callers such as `parseFloat(bn.toString())` (returned `NaN`). `toString()` now returns the numeric value as a string, matching `valueOf()`/`toJSON()`.
