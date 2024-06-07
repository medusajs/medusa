const DEFAULT_PROPERTIES = [
  "id",
  "status",
  "created_at",
  "email",
  "display_id",
  // "payment_status", // -> TODO replacement for this
  "total",
  "currency_code",
]

const DEFAULT_RELATIONS = ["*customer", "*sales_channel"]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
