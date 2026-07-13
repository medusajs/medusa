---
"@medusajs/framework": patch
"@medusajs/medusa": patch
"@medusajs/types": patch
---

fix(framework,medusa): reject sorting the admin orders list by computed fields (total, payment_status, fulfillment_status) with a 400 instead of a 500
