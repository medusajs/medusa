import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

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

export const allowedStoreOrderExtraFields = [
  "items.metadata",
  "items.product",
  "payment_collections.payments",
  "payment_collections.payment_sessions",
  "fulfillments",
]

export const allowedStoreOrderListExtraFields = [
  ...allowedStoreOrderExtraFields,
  "email",
  "region_id",
  "subtotal",
  "shipping_total",
  "discount_total",
  "tax_total",
  "item_subtotal",
  "items",
  "items.variant",
  "shipping_address",
  "billing_address",
  "shipping_methods",
  "payment_collections",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRetrieveOrderFields,
  allowed: buildAllowedFields(
    defaultStoreRetrieveOrderFields,
    allowedStoreOrderExtraFields
  ),
  disallowed: disallowedStoreFields,
  storeRelationsLimit: 3,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreOrderFields,
  allowed: buildAllowedFields(
    defaultStoreOrderFields,
    allowedStoreOrderListExtraFields
  ),
  disallowed: disallowedStoreFields,
  isList: true,
}
