---
"@medusajs/dashboard": patch
---

Fix duplicate `"actions"` column id in the customer order table that produced a duplicate React key warning (`0_actions`). The `CountryCell` display column now uses a unique `country` id.