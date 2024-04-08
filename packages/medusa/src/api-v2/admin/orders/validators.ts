import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetOrdersOrderParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersOrderParamsType = z.infer<
  typeof AdminGetOrdersOrderParams
>

/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export const AdminGetOrdersParams = createFindParams({
  limit: 15,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>
