---
"@medusajs/core-flows": patch
---

fix(core-flows): acquire lock before fetching cart in updateCartPromotionsWorkflow to prevent duplicate line item adjustments under concurrent requests
