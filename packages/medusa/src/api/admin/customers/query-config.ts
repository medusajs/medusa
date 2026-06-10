/**
 * Entity identifiers for customer-related queries.
 */
export enum Entities {
  customer = "customer",
  customer_address = "customer_address",
}

/**
 * Default fields returned when retrieving customers in admin endpoints.
 */
export const defaultAdminCustomerFields = [
  "id",
  "company_name",
  "first_name",
  "last_name",
  "email",
  "phone",
  "metadata",
  "has_account",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
]

/**
 * Fields allowed to be selected in admin customer queries.
 */
export const allowed = [
  "id",
  "company_name",
  "first_name",
  "last_name",
  "email",
  "phone",
  "metadata",
  "has_account",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
  "addresses",
  "groups",
]

/**
 * Query configuration for retrieving a single customer in admin endpoints.
 */
export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCustomerFields,
  allowed,
  isList: false,
  entity: Entities.customer,
}

/**
 * Query configuration for listing customers in admin endpoints.
 */
export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.customer,
}

/**
 * Default fields returned when retrieving customer addresses in admin endpoints.
 */
export const defaultAdminCustomerAddressFields = [
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
  "created_at",
  "updated_at",
]

/**
 * Query configuration for retrieving a single customer address in admin endpoints.
 */
export const retrieveAddressTransformQueryConfig = {
  defaults: defaultAdminCustomerAddressFields,
  isList: false,
  entity: Entities.customer_address,
}

/**
 * Query configuration for listing customer addresses in admin endpoints.
 */
export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
  entity: Entities.customer_address,
}
