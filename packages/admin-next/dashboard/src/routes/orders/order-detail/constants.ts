const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "email",
  "display_id",
  "currency_code",
  "total",
  "subtotal",
  "discounts_total",
  "shipping_total",
  "tax_total",
]

const DEFAULT_RELATIONS = [
  "*customer",
  "*items", // -> we get LineItem here with added `quantity` and `detail` which is actually an OrderItem (which is a parent object to LineItem in the DB)
  "*items.variant.options",
  "*shipping_address",
  "*billing_address",
  "*sales_channel",
  "*promotion",
  "*fulfillments",
  "*fulfillments.items",
  "*payment_collections",
  // TODO: Add back when payments are working
  // "*payment_collections.payments",
  // "*payment_collections.payments.refunds",
  // "*payment_collections.payments.captures",
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
