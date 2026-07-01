---
"@medusajs/pricing": patch
---

perf(pricing): pre-filter matching price lists in calculatePrices

When the pricing context contains rule attributes, `PricingRepository.calculatePrices` evaluated price list rules through a `LEFT JOIN LATERAL` on `price_list_rule` executed once per candidate price row, so the query cost grew as O(candidate prices x price lists). With the B2B pattern "one price list per customer group, one price per variant" (~800 active price lists), a page of 20 price sets took ~844 ms and 99.8% of scanned rows were discarded by the final filter. The set of active price lists whose rules all match the context is now resolved once in a pre-filtered derived table joined against `price`, which drops the per-row `plr_stats` LATERAL and makes the cost independent of the number of price lists (~95 ms for the same page, byte-identical results). Price-level rules (`pr_stats`) and the simple-context path are unchanged.
