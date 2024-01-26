import { Customer } from "../../.."

export const defaultStoreCustomersRelations = [
  "shipping_addresses",
  "billing_address",
]
export const allowedStoreCustomersRelations = [
  ...defaultStoreCustomersRelations,
]
export const defaultStoreCustomersFields: (keyof Customer)[] = [
  "id",
  "email",
  "first_name",
  "last_name",
  "billing_address_id",
  "phone",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
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
