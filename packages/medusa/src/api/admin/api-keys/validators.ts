import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { ApiKeyType } from "@medusajs/utils"

export const AdminGetApiKeyParams = createSelectParams()

export type AdminGetApiKeysParamsType = z.infer<typeof AdminGetApiKeysParams>
export const AdminGetApiKeysParams = createFindParams({
  offset: 0,
  limit: 20,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    title: z.union([z.string(), z.array(z.string())]).optional(),
    token: z.union([z.string(), z.array(z.string())]).optional(),
    type: z.nativeEnum(ApiKeyType).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetApiKeysParams.array()).optional(),
    $or: z.lazy(() => AdminGetApiKeysParams.array()).optional(),
  })
)

export type AdminCreateApiKeyType = z.infer<typeof AdminCreateApiKey>
export const AdminCreateApiKey = z.object({
  title: z.string(),
  type: z.nativeEnum(ApiKeyType),
})

export type AdminUpdateApiKeyType = z.infer<typeof AdminUpdateApiKey>
export const AdminUpdateApiKey = z.object({
  title: z.string(),
})

export type AdminRevokeApiKeyType = z.infer<typeof AdminRevokeApiKey>
export const AdminRevokeApiKey = z.object({
  revoke_in: z.number().optional(),
})
