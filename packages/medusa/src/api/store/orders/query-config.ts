// TODO: This is copied over from admin. Scope what fields and relations are allowed for store

export const defaultStoreOrderFields = [
  "id",
  "status",
  "version",
  "summary",
  "display_id",
  "total",
  "currency_code",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultStoreRetrieveOrderFields = [
  "id",
  "status",
  "version",
  "summary",
  "currency_code",
  "display_id",
  "total",
  "subtotal",
  "tax_total",
  "discount_total",
  "discount_tax_total",
  "original_total",
  "original_tax_total",
  "item_total",
  "item_subtotal",
  "item_tax_total",
  "original_item_total",
  "original_item_subtotal",
  "original_item_tax_total",
  "item_refundable_total",
  "shipping_total",
  "shipping_subtotal",
  "shipping_tax_total",
  "original_shipping_tax_total",
  "original_shipping_tax_subtotal",
  "original_shipping_total",
  "created_at",
  "updated_at",
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

export const listTransformQueryConfig = {
  defaults: defaultStoreOrderFields,
  isList: true,
}
