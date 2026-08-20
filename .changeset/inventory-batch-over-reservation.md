---
"@medusajs/inventory": patch
---

fix(inventory): validate summed demand per location when creating reservations in a batch

`createReservationItems` validated each entry in a batch against the same, un-decremented `available_quantity`, so two entries targeting the same inventory item and location — e.g. two cart line items whose variants share an inventory item via a bundle — could each pass independently while their combined quantity exceeded stock. Both reservations were then created, over-reserving the location (`available_quantity` could go negative) and overselling.

The batch now validates each entry against the running availability after accounting for the quantities already claimed by earlier entries in the same call, consistent with the single-reservation and quantity-increase checks. `allow_backorder` entries are still skipped.
