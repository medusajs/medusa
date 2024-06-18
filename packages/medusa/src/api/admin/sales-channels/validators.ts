import { z } from "zod"
import { OptionalBooleanValidator } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetSalesChannelParamsType = z.infer<
  typeof AdminGetSalesChannelParams
>
export const AdminGetSalesChannelParams = createSelectParams()

export type AdminGetSalesChannelsParamsType = z.infer<
  typeof AdminGetSalesChannelsParams
>
export const AdminGetSalesChannelsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string().nullish(),
    is_disabled: OptionalBooleanValidator,
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    location_id: z.union([z.string(), z.array(z.string())]).optional(),
    publishable_key_id: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetSalesChannelsParams.array()).optional(),
    $or: z.lazy(() => AdminGetSalesChannelsParams.array()).optional(),
  })
)

export type AdminCreateSalesChannelType = z.infer<
  typeof AdminCreateSalesChannel
>
export const AdminCreateSalesChannel = z.object({
  name: z.string(),
  description: z.string().nullish(),
  is_disabled: z.boolean().nullish(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
})

export type AdminUpdateSalesChannelType = z.infer<
  typeof AdminUpdateSalesChannel
>
export const AdminUpdateSalesChannel = z.object({
  name: z.string().nullish(),
  description: z.string().nullable().nullish(),
  is_disabled: z.boolean().nullish(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
})
