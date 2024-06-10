export interface AdminUpdateInventoryLevel {
  stocked_quantity?: number
  incoming_quantity?: number
}

export interface AdminCreateInventoryLevel {
  location_id: string
  stocked_quantity?: number
  incoming_quantity?: number
}

export interface AdminBatchUpdateInventoryLevelLocation {
  creates?: AdminCreateInventoryLevel[]
  updates?: AdminUpdateInventoryLevel[]
  deletes?: never // TODO - not implemented
}
