---
"@medusajs/payment": patch
---

Validate amount in `roundToCurrencyPrecision`: throw a `MedusaError` (`INVALID_DATA`) for negative, `NaN`, `null`/`undefined`, and non-numeric amounts instead of silently returning a rounded value, and normalize the currency code to uppercase
