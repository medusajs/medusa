import { z } from "zod"
import { booleanString } from "../../utils/common-validators"
import { createFindParams, createOperatorMap } from "../../utils/validators"

export type AdminGetProductVariantsParamsType = z.infer<
  typeof AdminGetProductVariantsParams
>
export const AdminGetProductVariantsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    manage_inventory: booleanString().optional(),
    allow_backorder: booleanString().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductVariantsParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductVariantsParams.array()).optional(),
  })
)
