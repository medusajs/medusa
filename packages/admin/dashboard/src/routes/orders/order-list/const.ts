export const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "email",
  "display_id",
  "custom_display_id",
  "payment_status",
  "fulfillment_status",
  "total",
  "currency_code",
]

export const DEFAULT_RELATIONS = [
  "*customer",
  "*sales_channel",
  "*payment_collections",
  "*shipping_address",
  "*tags",
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`

/**
 * Additional relations the Ready to Ship table needs on top of the
 * default order list fields: the unfulfilled items' variant dimensions
 * (for the Package column, via `computeOrderParcel`) and the order's
 * shipping method together with the nested chain down to the shipping
 * option's location (for the Ship From and Shipping Rate columns).
 */
export const READY_TO_SHIP_RELATIONS = [
  ...DEFAULT_RELATIONS,
  "*items",
  "*items.variant",
  "+items.variant.weight",
  "+items.variant.length",
  "+items.variant.width",
  "+items.variant.height",
  "+items.detail.fulfilled_quantity",
  "*shipping_methods",
  "+shipping_methods.shipping_option.service_zone.fulfillment_set.location.name",
]

export const READY_TO_SHIP_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${READY_TO_SHIP_RELATIONS.join(",")}`

/**
 * Additional relation the Shipped table needs on top of the default order
 * list fields: the order's fulfillments, for the Carrier and Ship Date
 * columns (resolved from the most recently shipped fulfillment's
 * `provider_id`/`shipped_at`). The Tracking Status column reads
 * `fulfillment_status`, which is already part of `DEFAULT_PROPERTIES`.
 */
export const SHIPPED_RELATIONS = [...DEFAULT_RELATIONS, "*fulfillments"]

export const SHIPPED_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${SHIPPED_RELATIONS.join(",")}`
