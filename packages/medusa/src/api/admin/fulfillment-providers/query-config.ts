export enum Entities {
  fulfillment_provider = "fulfillment_provider",
}

export const defaultAdminFulfillmentProvidersFields = ["id", "is_enabled"]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFulfillmentProvidersFields,
  isList: false,
  entity: Entities.fulfillment_provider,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.fulfillment_provider,
}
