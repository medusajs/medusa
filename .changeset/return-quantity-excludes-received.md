---
"@medusajs/order": patch
"@medusajs/dashboard": patch
---

fix(order,dashboard): stop return requests exceeding the returnable quantity. Units already received or dismissed on an earlier return are no longer counted as available to return, and the return, exchange and claim forms cap the quantity input at the returnable quantity.
