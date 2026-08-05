/**
 * Fields the orders lists may NOT be sorted by. These are computed at query
 * time — not columns on the order table — so ordering by them throws at the
 * database layer. They remain selectable; they just can't be sort keys.
 * The totals mirror `shouldIncludeTotals` in the order module service.
 *
 * Shared by the admin and store orders list routes so the computed totals only
 * have to be kept in sync in one place.
 */
export const disallowedOrderSortFields = [
  "payment_status",
  "fulfillment_status",
  "summary",
  "total",
  "subtotal",
  "tax_total",
  "discount_total",
  "discount_subtotal",
  "discount_tax_total",
  "original_total",
  "original_subtotal",
  "original_tax_total",
  "item_total",
  "item_subtotal",
  "item_tax_total",
  "original_item_total",
  "original_item_subtotal",
  "original_item_tax_total",
  "shipping_total",
  "shipping_subtotal",
  "shipping_tax_total",
  "original_shipping_total",
  "original_shipping_subtotal",
  "original_shipping_tax_total",
  "credit_line_total",
  "credit_line_subtotal",
  "credit_line_tax_total",
  "pending_difference",
  "refundable_amount",
]
