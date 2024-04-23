export const defaultAdminFulfillmentProvidersFields = ["id", "is_enabled"]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFulfillmentProvidersFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
