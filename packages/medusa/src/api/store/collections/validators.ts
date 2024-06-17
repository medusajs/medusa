import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { z } from "zod"

export const StoreGetCollectionParams = createSelectParams()

export type StoreGetCollectionsParamsType = z.infer<
  typeof StoreGetCollectionsParams
>
export const StoreGetCollectionsParams = createFindParams({
  offset: 0,
  limit: 10,
  order: "-created_at",
}).merge(
  z.object({
    q: z.string().optional(),
    title: z.union([z.string(), z.array(z.string())]).optional(),
    handle: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => StoreGetCollectionsParams.array()).optional(),
    $or: z.lazy(() => StoreGetCollectionsParams.array()).optional(),
  })
)
