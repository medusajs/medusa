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
  delete?: string[] // a list of location_ids
  update?: never // TODO - not implemented // AdminUpdateInventoryLevel[]
  create?: AdminCreateInventoryLevel[]
}
