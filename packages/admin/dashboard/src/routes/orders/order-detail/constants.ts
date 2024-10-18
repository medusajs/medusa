const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "canceled_at",
  "email",
  "display_id",
  "currency_code",
  // --- TOTALS ---
  "total",
  "item_total",
  "shipping_subtotal",
  "subtotal",
  "discount_total",
  "discount_subtotal",
  "shipping_total",
  "shipping_tax_total",
  "tax_total",
  "refundable_total",
  "order_change",
]

const DEFAULT_RELATIONS = [
  "*customer",
  "*items", // -> we get LineItem here with added `quantity` and `detail` which is actually an OrderItem (which is a parent object to LineItem in the DB)
  "*items.variant",
  "*items.variant.product",
  "*items.variant.options",
  "+items.variant.manage_inventory",
  "*items.variant.inventory_items.inventory",
  "+items.variant.inventory_items.required_quantity",
  "+summary",
  "*shipping_address",
  "*billing_address",
  "*sales_channel",
  "*promotion",
  "*shipping_methods",
  "*fulfillments",
  "*fulfillments.items",
  "*fulfillments.labels",
  "*fulfillments.labels",
  "*payment_collections",
  "*payment_collections.payments",
  "*payment_collections.payments.refunds",
  "*payment_collections.payments.refunds.refund_reason",
  "region.automatic_taxes",
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
