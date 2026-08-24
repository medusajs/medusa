---
"@medusajs/inventory": patch
---

Lock inventory level rows while creating, updating, or deleting reservations so concurrent service calls can no longer oversubscribe stock or desynchronize `reserved_quantity` from the live reservation rows.
