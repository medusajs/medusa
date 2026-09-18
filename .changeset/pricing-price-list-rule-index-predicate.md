---
"@medusajs/pricing": patch
---

fix(pricing): correct the inverted partial predicate on `IDX_price_list_rule_price_list_id` so price-list rule lookups can use the index instead of sequentially scanning `price_list_rule`
