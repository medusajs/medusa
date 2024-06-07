export interface AdminUpdateInventoryLevel {
  stocked_quantity?: number
  incoming_quantity?: number
}

export interface AdminCreateInventoryLevel {
  location_id: string
  stocked_quantity?: number
  incoming_quantity?: number
}

export interface AdminBatchPostInventoryLevelLocation {
  create?: AdminCreateInventoryLevel[]
  update?: AdminUpdateInventoryLevel[]
  delete?: never // TODO - not implemented
}
