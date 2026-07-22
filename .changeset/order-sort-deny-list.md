---
"@medusajs/framework": patch
"@medusajs/medusa": patch
"@medusajs/types": patch
---

fix(framework,medusa): reject sorting the admin and store orders lists by computed fields (totals, payment_status, fulfillment_status) with a 400 instead of a 500
