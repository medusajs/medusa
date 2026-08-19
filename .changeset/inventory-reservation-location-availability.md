---
"@medusajs/inventory": patch
---

fix(inventory): validate destination stock when moving a reservation to a new location

`updateReservationItems` skipped the availability check when a reservation's `location_id` changed. It derived the amount to validate as `data.quantity - reservation.quantity` (which is `0` when the quantity is unchanged, or when the quantity isn't part of the payload), so the destination location's stock was never actually verified. As a result, moving a reservation to a location without enough stock succeeded and over-reserved that location — its `available_quantity` could go negative — even though creating the same reservation directly, or increasing an existing reservation's quantity, is correctly rejected.

On a location change, the full reservation quantity is now validated against the destination location's availability, consistent with reservation creation and same-location quantity increases.
