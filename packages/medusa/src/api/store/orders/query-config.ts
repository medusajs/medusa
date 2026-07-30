// TODO: This is copied over from admin. Scope what fields and relations are allowed for store

export const defaultStoreOrderFields = [
  "id",
  "status",
  "summary",
  "display_id",
  "custom_display_id",
  "total",
  "currency_code",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultStoreRetrieveOrderFields = [
  "id",
  "status",
  "summary",
  "currency_code",
  "display_id",
  "custom_display_id",
  "region_id",
  "email",
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
  "original_shipping_tax_total",
  "original_shipping_subtotal",
  "original_shipping_total",
  "credit_line_total",
  "credit_line_subtotal",
  "credit_line_tax_total",
  "created_at",
  "updated_at",
  "*credit_lines",
  "*items",
  "*items.tax_lines",
  "*items.adjustments",
  "*items.detail",
  "*items.variant",
  "*items.variant.product",
  "*shipping_address",
  "*billing_address",
  "*shipping_methods",
  "*shipping_methods.tax_lines",
  "*shipping_methods.adjustments",
  "*payment_collections",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRetrieveOrderFields,
  isList: false,
}

/**
 * Fields the orders list may NOT be sorted by. These are computed at query
 * time — not columns on the order table — so ordering by them throws at the
 * database layer. They remain selectable; they just can't be sort keys.
 * The totals mirror `shouldIncludeTotals` in the order module service.
 * Kept in sync with `disallowedAdminOrderSortFields` on the admin route.
 */
export const disallowedStoreOrderSortFields = [
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

export const listTransformQueryConfig = {
  defaults: defaultStoreOrderFields,
  disallowedOrderBy: disallowedStoreOrderSortFields,
  isList: true,
}
