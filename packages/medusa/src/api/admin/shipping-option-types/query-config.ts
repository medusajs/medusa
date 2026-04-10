export enum Entities {
  shipping_option_type = "shipping_option_type",
}

export const defaultAdminShippingOptionTypeFields = [
  "id",
  "label",
  "code",
  "description",
  "created_at",
  "updated_at",
]

export const retrieveShippingOptionTypeTransformQueryConfig = {
  defaults: defaultAdminShippingOptionTypeFields,
  isList: false,
  entity: Entities.shipping_option_type,
}

export const listShippingOptionTypesTransformQueryConfig = {
  ...retrieveShippingOptionTypeTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.shipping_option_type,
}
