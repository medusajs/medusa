---
"@medusajs/fulfillment": patch
---

fix(fulfillment): compare numeric shipping option rule values numerically

Shipping option rules using `gt`, `gte`, `lt` or `lte` treated any value accepted by `Date.parse` as a date. `Date.parse` accepts bare integer strings as years, so a rule such as `{ attribute: "total_weight", operator: "lt", value: "2000" }` compared `2040-01-01 < 2000-01-01` for a cart weighing 40, and the option was filtered out. Values that parse as numbers now always take the numeric comparison path.
