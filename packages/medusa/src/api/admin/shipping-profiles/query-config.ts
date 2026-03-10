export enum Entities {
  shipping_profile = "shipping_profile",
}

export const defaultAdminShippingProfileFields = [
  "id",
  "name",
  "type",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminShippingProfileFields,
  isList: false,
  entity: Entities.shipping_profile,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.shipping_profile,
}
