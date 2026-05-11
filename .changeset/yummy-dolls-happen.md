---
"@medusajs/core-flows": patch
---

acquire lock before fetching cart in updateCartPromotionsWorkflow to prevent duplicate line item adjustments under concurrent requests
