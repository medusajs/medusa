import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetCollectionParams = createSelectParams()

export type AdminGetCollectionsParamsType = z.infer<
  typeof AdminGetCollectionsParams
>
export const AdminGetCollectionsParams = createFindParams({
  offset: 0,
  limit: 10,
}).merge(
  z.object({
    q: z.string().optional(),
    title: z.union([z.string(), z.array(z.string())]).optional(),
    handle: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetCollectionsParams.array()).optional(),
    $or: z.lazy(() => AdminGetCollectionsParams.array()).optional(),
  })
)

export type AdminCreateCollectionType = z.infer<typeof AdminCreateCollection>
export const AdminCreateCollection = z.object({
  title: z.string(),
  handle: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateCollectionType = z.infer<typeof AdminUpdateCollection>
export const AdminUpdateCollection = z.object({
  title: z.string().optional(),
  handle: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})
