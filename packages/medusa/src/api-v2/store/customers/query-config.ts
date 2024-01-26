import { CustomerDTO } from "@medusajs/types"

export const defaultStoreCustomersRelations = [
  "default_billing_address",
  "default_shipping_address",
  "addresses",
  "groups",
]
export const allowedStoreCustomersRelations = [
  ...defaultStoreCustomersRelations,
]
export const defaultStoreCustomersFields: (keyof CustomerDTO)[] = [
  "id",
  "email",
  "default_billing_address_id",
  "default_shipping_address_id",
  "company_name",
  "first_name",
  "last_name",
  "phone",
  "metadata",
  "created_by",
  "deleted_at",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStoreCustomersFields,
  defaultRelations: defaultStoreCustomersRelations,
  allowedRelations: allowedStoreCustomersRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
