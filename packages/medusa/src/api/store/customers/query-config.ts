const defaultStoreCustomersFields = [
  "id",
  "email",
  "company_name",
  "first_name",
  "last_name",
  "phone",
  "metadata",
  "has_account",
  "deleted_at",
  "created_at",
  "updated_at",
  "*addresses",
]

/**
 * Query configuration for retrieving a single customer in store endpoints.
 */
export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCustomersFields,
  allowed: [
    ...defaultStoreCustomersFields.map((f) => f.replace("*", "")),
    "orders",
  ],
  isList: false,
}

/**
 * Default fields returned when retrieving customer addresses in store endpoints.
 */
export const defaultStoreCustomerAddressFields = [
  "id",
  "address_name",
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
  "is_default_shipping",
  "is_default_billing",
  "created_at",
  "updated_at",
]

/**
 * Query configuration for retrieving a single customer address in store endpoints.
 */
export const retrieveAddressTransformQueryConfig = {
  defaults: defaultStoreCustomerAddressFields,
  isList: false,
}

/**
 * Query configuration for listing customer addresses in store endpoints.
 */
export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
