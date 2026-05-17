export enum Entities {
  channel_price = "channel_price",
}

export const defaultAdminChannelPriceFields = [
  "id",
  "sales_material_id",
  "shop_id",
  "customer_class_id",
  "price_type",
  "currency_code",
  "amount",
  "start_at",
  "end_at",
  "min_quantity",
  "max_quantity",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminChannelPriceRelations = []

export const allowedAdminChannelPriceRelations = []

export const allowedAdminChannelPriceFields = defaultAdminChannelPriceFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminChannelPriceFields,
  isList: false,
  entity: Entities.channel_price,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.channel_price,
}
