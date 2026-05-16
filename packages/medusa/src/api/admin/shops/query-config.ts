export enum Entities {
  shop = "shop",
}

export const defaultAdminShopFields = [
  "id",
  "shop_code",
  "shop_name",
  "platform_type",
  "platform_shop_id",
  "org_id",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminShopRelations = []

export const allowedAdminShopRelations = []

export const allowedAdminShopFields = defaultAdminShopFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminShopFields,
  isList: false,
  entity: Entities.shop,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.shop,
}
