const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "email",
  // "fulfillment_status", // -> todo replacement for this
  "payment_status",
  "total",
  "display_id",
  "currency_code",
]

const DEFAULT_RELATIONS = [
  "*customer",
  "*items",
  // "*sales_channel", // TODO link
  "*shipping_address",
]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
