import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetReservationParamsType = z.infer<
  typeof AdminGetReservationParams
>
export const AdminGetReservationParams = createSelectParams()

export type AdminGetReservationsParamsType = z.infer<
  typeof AdminGetReservationsParams
>
export const AdminGetReservationsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    location_id: z.union([z.string(), z.array(z.string())]).optional(),
    inventory_item_id: z.union([z.string(), z.array(z.string())]).optional(),
    line_item_id: z.union([z.string(), z.array(z.string())]).optional(),
    created_by: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.union([z.string(), createOperatorMap()]).optional(),
    quantity: createOperatorMap(z.number(), parseFloat).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminCreateReservationType = z.infer<typeof AdminCreateReservation>
export const AdminCreateReservation = z
  .object({
    line_item_id: z.string().nullish(),
    location_id: z.string(),
    inventory_item_id: z.string(),
    quantity: z.number(),
    description: z.string().nullish(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()

export type AdminUpdateReservationType = z.infer<typeof AdminUpdateReservation>
export const AdminUpdateReservation = z
  .object({
    location_id: z.string().optional(),
    quantity: z.number().optional(),
    description: z.string().nullish(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()
