export const STORE_MODE = ["normal", "discount"] as const
export type StoreMode = (typeof STORE_MODE)[number]

export interface CreateStoreInventoryDTO {
  location_id: string
  material_id: string
  online_stock?: number
  online_reserved?: number
  share_stock?: number
  share_reserved?: number
  in_transit_stock?: number
  store_mode?: StoreMode
  metadata?: Record<string, unknown>
}

export interface UpdateStoreInventoryDTO extends Partial<CreateStoreInventoryDTO> {}
