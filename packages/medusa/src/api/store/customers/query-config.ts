import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

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

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCustomersFields,
  allowed: buildAllowedFields(defaultStoreCustomersFields, ["orders"]),
  disallowed: disallowedStoreFields,
  isList: false,
}

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

export const retrieveAddressTransformQueryConfig = {
  defaults: defaultStoreCustomerAddressFields,
  allowed: buildAllowedFields(defaultStoreCustomerAddressFields),
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
