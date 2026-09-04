---
"@medusajs/utils": patch
---

fix(utils): honor decimalPlaces of 0 in MathBN.convert

`MathBN.convert(value, decimalPlaces)` guarded the rounding step with `if (decimalPlaces)`, so passing `0` (round to an integer, e.g. for zero-decimal currencies) was treated the same as omitting the argument and no rounding was applied. It now checks `decimalPlaces != null` so `0` rounds as expected while an omitted argument still skips rounding.
