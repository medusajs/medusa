---
"@medusajs/dashboard": patch
---

fix(dashboard): send price list quantity tiers as native fields

The price list forms wrote `min_quantity` and `max_quantity` into the generic `rules` object. Pricing resolves quantity against the native `min_quantity`/`max_quantity` columns on the price, which stayed null, so tiers created from the admin never applied during cart price calculation. Tiers stored as rules by an earlier version are still read back so existing price lists keep showing them.
