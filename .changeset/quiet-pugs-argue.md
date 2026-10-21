---
"@medusajs/loyalty-plugin": patch
---

fix(loyalty-plugin): create gift cards in locales that use a comma as the decimal separator

The gift card creation form stored the currency input's formatted value, which
keeps the locale's decimal separator (e.g. "14,13"). That string could not be
coerced to a number, so the form rejected valid input with "Invalid input".

The form now keeps the formatted value for display and sends the input's
parsed `float` to the API, which is locale independent.
