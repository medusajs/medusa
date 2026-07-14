---
"@medusajs/eslint-plugin": patch
---

Remove the `use-query-context-utility` rule. It required wrapping the entire `query.graph` / `query.index` `context` object with `QueryContext(...)`, but the correct placement is query-specific: pricing queries wrap the `calculated_price` leaf (`context: { variants: { calculated_price: QueryContext(...) } }`), while others (such as shipping options) wrap the whole context. As written, the rule flagged correct pricing code and autofixed it into a runtime error (`Trying to query by not existing property Product.context`), contradicting the official docs and the framework's own usage. Correct placement cannot be determined generically, so the rule is removed. Fixes #15821.
