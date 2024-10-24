import { z } from "zod"
import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetSalesChannelParamsType = z.infer<
  typeof AdminGetSalesChannelParams
>
export const AdminGetSalesChannelParams = createSelectParams()

export const AdminGetSalesChannelsParamsDirectFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.string().optional(),
  is_disabled: booleanString().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetSalesChannelsParamsType = z.infer<
  typeof AdminGetSalesChannelsParams
>
export const AdminGetSalesChannelsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetSalesChannelsParamsDirectFields)
  .merge(applyAndAndOrOperators(AdminGetSalesChannelsParamsDirectFields))
  .merge(
    z.object({
      location_id: z.union([z.string(), z.array(z.string())]).optional(),
      publishable_key_id: z.union([z.string(), z.array(z.string())]).optional(),
    })
  )

export type AdminCreateSalesChannelType = z.infer<
  typeof AdminCreateSalesChannel
>
export const AdminCreateSalesChannel = z.object({
  name: z.string(),
  description: z.string().nullish(),
  is_disabled: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminUpdateSalesChannelType = z.infer<
  typeof AdminUpdateSalesChannel
>
export const AdminUpdateSalesChannel = z.object({
  name: z.string().optional(),
  description: z.string().nullish(),
  is_disabled: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
