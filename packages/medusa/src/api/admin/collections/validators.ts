import { z } from "@medusajs/framework/zod"
import { applyAndAndOrOperators } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"

export const AdminGetCollectionParams = createSelectParams()

export const AdminGetCollectionsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.union([z.string(), z.array(z.string())]).optional(),
  handle: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetCollectionsParamsType = z.infer<
  typeof AdminGetCollectionsParams
>
export const AdminGetCollectionsParams = createFindParams({
  offset: 0,
  limit: 10,
})
  .merge(AdminGetCollectionsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetCollectionsParamsFields))

export type AdminCreateCollectionType = z.infer<typeof CreateCollection>
export const CreateCollection = z.object({
  title: z.string(),
  handle: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})

export const AdminCreateCollection = WithAdditionalData(CreateCollection)

export type AdminUpdateCollectionType = z.infer<typeof UpdateCollection>
export const UpdateCollection = z.object({
  title: z.string().optional(),
  handle: z.string().optional(),
  metadata: z.record(z.unknown()).nullish(),
})

export const AdminUpdateCollection = WithAdditionalData(UpdateCollection)
