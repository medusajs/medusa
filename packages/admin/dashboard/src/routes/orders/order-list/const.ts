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

export const DEFAULT_RELATIONS = ["*customer", "*sales_channel", "*payment_collections"]

export const DEFAULT_FIELDS = `${DEFAULT_PROPERTIES.join(
  ","
)},${DEFAULT_RELATIONS.join(",")}`
