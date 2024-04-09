export const defaultAdminCustomerRelations = []
export const allowedAdminCustomerRelations = ["groups", "addresses"]
export const defaultAdminCustomerFields = [
  "id",
  "company_name",
  "first_name",
  "last_name",
  "email",
  "phone",
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

export const defaultAdminCustomerAddressRelations = []
export const allowedAdminCustomerAddressRelations = ["customer"]
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
  defaultFields: defaultAdminCustomerAddressFields,
  defaultRelations: defaultAdminCustomerAddressRelations,
  allowedRelations: allowedAdminCustomerAddressRelations,
  isList: false,
}

export const listAddressesTransformQueryConfig = {
  ...retrieveAddressTransformQueryConfig,
  isList: true,
}
