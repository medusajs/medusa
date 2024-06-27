const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "email",
  // "payment_status", // -> TODO replacement for this
  "display_id",
  "currency_code",
  // --- TOTALS ---
  "total",
  "subtotal",
  "discounts_total",
  "shipping_total",
  "shipping_tax_total",
  "tax_total",
]

const DEFAULT_RELATIONS = [
  "*customer",
  "*items", // -> we get LineItem here with added `quantity` and `detail` which is actually an OrderItem (which is a parent object to LineItem in the DB)
  "*items.variant",
  "*items.variant.product",
  "*items.variant.options",
  "*shipping_address",
  "*billing_address",
  "*sales_channel",
  "*promotion",
  "*fulfillments",
  "*fulfillments.items",
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
