---
"@medusajs/dashboard": patch
---

fix(dashboard): keep long unbroken names and address lines inside the order detail customer section. The address value column could not shrink below the longest word, so the text overflowed the card instead of wrapping.
