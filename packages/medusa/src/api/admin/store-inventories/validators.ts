import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const StoreMode = z.enum(["normal", "discount"])

export const AdminCreateStoreInventory = z.object({
  location_id: z.string(),
  material_id: z.string(),
  online_stock: z.number().optional(),
  online_reserved: z.number().optional(),
  share_stock: z.number().optional(),
  share_reserved: z.number().optional(),
  in_transit_stock: z.number().optional(),
  store_mode: StoreMode.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminCreateStoreInventoryType = z.infer<
  typeof AdminCreateStoreInventory
>

export const AdminUpdateStoreInventory = z.object({
  location_id: z.string().optional(),
  material_id: z.string().optional(),
  online_stock: z.number().optional(),
  online_reserved: z.number().optional(),
  share_stock: z.number().optional(),
  share_reserved: z.number().optional(),
  in_transit_stock: z.number().optional(),
  store_mode: StoreMode.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateStoreInventoryType = z.infer<
  typeof AdminUpdateStoreInventory
>

export const AdminGetStoreInventoryParams = createSelectParams()

export const AdminGetStoreInventoriesParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    location_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    material_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    store_mode: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
