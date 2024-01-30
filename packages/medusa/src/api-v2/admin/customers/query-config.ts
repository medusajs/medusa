export const defaultAdminCustomerRelations = []
export const allowedAdminCustomerRelations = [
  "groups",
  "default_shipping_address",
  "default_billing_address",
  "addresses",
]
export const defaultAdminCustomerFields = [
  "id",
  "company_name",
  "first_name",
  "last_name",
  "email",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminCustomerFields,
  defaultRelations: defaultAdminCustomerRelations,
  allowedRelations: allowedAdminCustomerRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
