---
"@medusajs/settings": patch
"@medusajs/medusa": patch
---

fix(medusa,settings): prevent "Trying to order by not existing property" errors when sorting orders by the computed `total`, `payment_status`, or `fulfillment_status` fields. The admin orders list endpoint now ignores these non-sortable fields instead of failing, and the orders table reports them as non-sortable so the UI no longer offers the invalid sort.
