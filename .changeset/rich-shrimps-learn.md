---
"@medusajs/medusa": patch
---
fix: Gift cart tax claculation wrongly calculated

Adds tax_rate column to gift_card table to calculate tax accurately for a gift card. This change includes a backfill migration to update gift cards that were already created.
