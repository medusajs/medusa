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
  "subtotal",
  "discounts_total",
  "shipping_total",
  "shipping_tax_total",
  "tax_total",
  "refundable_total",
]

const DEFAULT_RELATIONS = [
  "*customer",
  "*items", // -> we get LineItem here with added `quantity` and `detail` which is actually an OrderItem (which is a parent object to LineItem in the DB)
  "*items.variant",
  "*items.variant.product",
  "*items.variant.options",
  "+items.variant.manage_inventory",
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
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
