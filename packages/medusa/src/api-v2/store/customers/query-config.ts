import { CustomerDTO } from "@medusajs/types"

export const defaultStoreCustomersRelations = []
export const allowedStoreCustomersRelations = ["addresses", "groups"]
export const defaultStoreCustomersFields: (keyof CustomerDTO)[] = [
  "id",
  "email",
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
  defaultFields: defaultStoreCustomersFields as string[],
  defaultRelations: defaultStoreCustomersRelations,
  allowedRelations: allowedStoreCustomersRelations,
  isList: false,
}

export const defaultStoreCustomerAddressRelations = []
export const allowedStoreCustomerAddressRelations = ["customer"]
export const defaultStoreCustomerAddressFields = [
  "id",
  "company",
  "customer_id",
  "first_name",
  "last_name",
  "address_1",
  "address_2",
  "city",
  "province",
  "postal_code",
  "country_code",
  "phone",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveAddressTransformQueryConfig = {
  defaultFields: defaultStoreCustomerAddressFields,
  defaultRelations: defaultStoreCustomerAddressRelations,
  allowedRelations: allowedStoreCustomerAddressRelations,
  isList: false,
}

export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
