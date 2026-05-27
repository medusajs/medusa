---
"@medusajs/dashboard": patch
---

fix(admin): color payment and fulfillment status badges in orders table

The `payment_status` and `fulfillment_status` cells in the new DataTable-driven orders list rendered with a hardcoded `color="grey"`, so every status looked the same regardless of state. They now use the existing `getOrderPaymentStatus` and `getOrderFulfillmentStatus` helpers in `lib/order-helpers.ts` to derive both the translated label and the appropriate `StatusBadge` color (green for paid/fulfilled, orange for partial or awaiting states, red for failed/refunded/canceled/not-paid), matching the pattern already in `lib/table/cell-renderers.tsx`.
