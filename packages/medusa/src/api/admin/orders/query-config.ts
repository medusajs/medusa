export enum Entities {
  order = "order",
  fulfillment = "fulfillment",
  credit_line = "credit_line",
}

export const defaultAdminOrderFields = [
  "id",
  "display_id",
  "custom_display_id",
  "status",
  "version",
  "summary",
  "total",
  "metadata",
  "locale",
  "created_at",
  "updated_at",
]

export const defaultAdminRetrieveOrderFields = [
  ...defaultAdminOrderFields,
  "region_id",
  "total",
  "subtotal",
  "tax_total",
  "discount_total",
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
  "*items",
  "*credit_lines",
  "*items.tax_lines",
  "*items.adjustments",
  "*items.variant",
  "*items.variant.product",
  "*items.detail",
  "*shipping_address",
  "*billing_address",
  "*shipping_methods",
  "*shipping_methods.tax_lines",
  "*shipping_methods.adjustments",
  "*payment_collections",
  "*payment_collections.payments",
  "*payment_collections.payments.refunds",
  "*payment_collections.payments.captures",
]

export const defaultAdminRetrieveOrderChangesFields = [
  "id",
  "order_id",
  "return_id",
  "claim_id",
  "exchange_id",
  "version",
  "change_type",
  "*actions",
  "description",
  "status",
  "internal_note",
  "created_by",
  "requested_by",
  "requested_at",
  "confirmed_by",
  "confirmed_at",
  "declined_by",
  "declined_reason",
  "metadata",
  "declined_at",
  "canceled_by",
  "canceled_at",
  "created_at",
  "updated_at",
  "carry_over_promotions",
]

export const defaultAdminOrderItemsFields = [
  "id",
  "order_id",
  "item_id",
  "version",
  "*item",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRetrieveOrderFields,
  isList: false,
  entity: Entities.order,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminOrderFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.order,
}

export const retrieveOrderChangesTransformQueryConfig = {
  defaults: defaultAdminRetrieveOrderChangesFields,
  isList: false,
}

export const listOrderItemsQueryConfig = {
  defaults: defaultAdminOrderItemsFields,
  defaultLimit: 100,
  isList: true,
}

export const listShippingOptionsQueryConfig = {
  defaultLimit: 100,
  isList: true,
}

export const defaultAdminExportOrderFields = [
  "id",
  "display_id",
  "status",
  "created_at",
  "updated_at",
  "email",
  "currency_code",
  "region_id",
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "gift_card_total",
  "total",
  "*customer",
  "*shipping_address",
  "*billing_address",
  "*sales_channel",
  "*items",
  "*shipping_methods",
  "*payment_collections",
  "*fulfillments",
]

export const exportTransformQueryConfig = {
  defaults: defaultAdminExportOrderFields,
  isList: true,
  entity: Entities.order,
}
