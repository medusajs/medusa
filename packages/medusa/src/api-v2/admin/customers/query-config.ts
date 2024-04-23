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

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCustomerFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}

export const defaultAdminCustomerAddressFields = [
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
  defaults: defaultAdminCustomerAddressFields,
  isList: false,
}

export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
