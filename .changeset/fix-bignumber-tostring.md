---
"@medusajs/utils": patch
---

fix(utils): add `BigNumber.toString()` to avoid `"[object Object]"` coercion

`BigNumber` implemented `valueOf`, `toJSON`, and `[Symbol.toPrimitive]` but not `toString()`, so an explicit `bn.toString()` fell through to `Object.prototype.toString` and returned `"[object Object]"`. This silently broke callers such as `parseFloat(bn.toString())` (returned `NaN`). `toString()` is now the single source of truth for string coercion, returning the same value as the `[Symbol.toPrimitive]` string hint, which delegates to it so the two stay consistent.
