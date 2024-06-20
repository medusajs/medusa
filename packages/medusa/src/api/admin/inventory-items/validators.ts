import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetInventoryItemParamsType = z.infer<
  typeof AdminGetInventoryItemParams
>
export const AdminGetInventoryItemParams = createSelectParams()

export type AdminGetInventoryItemsParamsType = z.infer<
  typeof AdminGetInventoryItemsParams
>
export const AdminGetInventoryItemsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(
    z.object({
      q: z.string().optional(),
      id: z.union([z.string(), z.array(z.string())]).optional(),
      sku: z.union([z.string(), z.array(z.string())]).optional(),
      origin_country: z.union([z.string(), z.array(z.string())]).optional(),
      mid_code: z.union([z.string(), z.array(z.string())]).optional(),
      hs_code: z.union([z.string(), z.array(z.string())]).optional(),
      material: z.union([z.string(), z.array(z.string())]).optional(),
      requires_shipping: OptionalBooleanValidator,
      weight: createOperatorMap(z.number(), parseFloat).optional(),
      length: createOperatorMap(z.number(), parseFloat).optional(),
      height: createOperatorMap(z.number(), parseFloat).optional(),
      width: createOperatorMap(z.number(), parseFloat).optional(),
      location_levels: z
        .object({
          location_id: z.union([z.string(), z.array(z.string())]).optional(),
        })
        .optional(),
      $and: z.lazy(() => AdminGetInventoryItemsParams.array()).optional(),
      $or: z.lazy(() => AdminGetInventoryItemsParams.array()).optional(),
    })
  )
  .strict()

export type AdminGetInventoryLocationLevelParamsType = z.infer<
  typeof AdminGetInventoryLocationLevelParams
>
export const AdminGetInventoryLocationLevelParams = createSelectParams()

export type AdminGetInventoryLocationLevelsParamsType = z.infer<
  typeof AdminGetInventoryLocationLevelsParams
>
export const AdminGetInventoryLocationLevelsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    location_id: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z
      .lazy(() => AdminGetInventoryLocationLevelsParams.array())
      .optional(),
    $or: z.lazy(() => AdminGetInventoryLocationLevelsParams.array()).optional(),
  })
)

export type AdminCreateInventoryLocationLevelType = z.infer<
  typeof AdminCreateInventoryLocationLevel
>
export const AdminCreateInventoryLocationLevel = z
  .object({
    location_id: z.string(),
    stocked_quantity: z.number().min(0).optional(),
    incoming_quantity: z.number().min(0).optional(),
  })
  .strict()

export type AdminUpdateInventoryLocationLevelType = z.infer<
  typeof AdminUpdateInventoryLocationLevel
>
export const AdminUpdateInventoryLocationLevel = z
  .object({
    stocked_quantity: z.number().min(0).optional(),
    incoming_quantity: z.number().min(0).optional(),
  })
  .strict()

export type AdminCreateInventoryItemType = z.infer<
  typeof AdminCreateInventoryItem
>
export const AdminCreateInventoryItem = z
  .object({
    sku: z.string().nullish(),
    hs_code: z.string().nullish(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    mid_code: z.string().nullish(),
    material: z.string().nullish(),
    title: z.string().nullish(),
    description: z.string().nullish(),
    requires_shipping: z.boolean().optional(),
    thumbnail: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    location_levels: z.array(AdminCreateInventoryLocationLevel).optional(),
  })
  .strict()

export type AdminUpdateInventoryItemType = z.infer<
  typeof AdminUpdateInventoryItem
>
export const AdminUpdateInventoryItem = z
  .object({
    sku: z.string().nullish(),
    hs_code: z.string().nullish(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    mid_code: z.string().nullish(),
    material: z.string().nullish(),
    title: z.string().nullish(),
    description: z.string().nullish(),
    requires_shipping: z.boolean().optional(),
    thumbnail: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
