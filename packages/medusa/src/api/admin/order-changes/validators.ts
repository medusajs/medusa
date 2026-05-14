import { z } from "@medusajs/framework/zod"

import { createOperatorMap, createSelectParams } from "../../utils/validators"

export const AdminOrderChangeParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    change_type: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export const AdminPostOrderChangesReqSchema = z.object({
  carry_over_promotions: z.boolean(),
})

export type AdminPostOrderChangesReqSchemaType = z.infer<
  typeof AdminPostOrderChangesReqSchema
>
