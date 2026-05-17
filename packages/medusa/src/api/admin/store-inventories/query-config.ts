export enum Entities {
  store_inventory = "store_inventory",
}

export const defaultAdminStoreInventoryFields = [
  "id",
  "location_id",
  "material_id",
  "online_stock",
  "online_reserved",
  "share_stock",
  "share_reserved",
  "in_transit_stock",
  "store_mode",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminStoreInventoryRelations = []

export const allowedAdminStoreInventoryRelations = []

export const allowedAdminStoreInventoryFields = defaultAdminStoreInventoryFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStoreInventoryFields,
  isList: false,
  entity: Entities.store_inventory,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.store_inventory,
}
