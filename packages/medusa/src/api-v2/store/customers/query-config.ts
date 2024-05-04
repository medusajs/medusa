const defaultStoreCustomersFields = [
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
  "*addresses",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCustomersFields,
  isList: false,
}

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
  defaults: defaultStoreCustomerAddressFields,
  isList: false,
}

export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
