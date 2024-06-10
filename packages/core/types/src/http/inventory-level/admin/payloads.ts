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
  delete?: AdminCreateInventoryLevel[]
  update?: AdminUpdateInventoryLevel[]
  create?: never // TODO - not implemented
}
