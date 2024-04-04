export const defaultAdminOrderRelations = [
  "items",
  "items.tax_lines",
  "items.adjustments",
  "items.detail",
  "shipping_address",
  "billing_address",
  "shipping_methods",
  "shipping_methods.tax_lines",
  "shipping_methods.adjustments",
]
export const allowedAdminOrderRelations = []

export const defaultAdminListOrderFields = [
  "id",
  "status",
  "version",
  "*items",
  "summary",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminOrderFields = [
  "id",
  "status",
  "version",
  "*items",
  "*items.tax_lines",
  "*items.adjustments",
  "*items.detail",
  "*items.tax_lines",
  "*items.adjustments",
  "*shipping_address",
  "*billing_address",
  "*shipping_methods",
  "*shipping_methods.tax_lines",
  "*shipping_methods.adjustments",
  "summary",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminOrderFields,
  defaultRelations: defaultAdminOrderRelations,
  allowedRelations: allowedAdminOrderRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultFields: defaultAdminListOrderFields,
  defaultLimit: 20,
  isList: true,
}
