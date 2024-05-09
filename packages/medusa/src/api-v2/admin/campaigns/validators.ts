import { CampaignBudgetType } from "@medusajs/utils"
import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const AdminGetCampaignParams = createSelectParams()

export type AdminGetCampaignsParamsType = z.infer<
  typeof AdminGetCampaignsParams
>
export const AdminGetCampaignsParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    campaign_identifier: z.string().optional(),
    currency: z.string().optional(),
    $and: z.lazy(() => AdminGetCampaignsParams.array()).optional(),
    $or: z.lazy(() => AdminGetCampaignsParams.array()).optional(),
  })
)

const CreateCampaignBudget = z.object({
  type: z.nativeEnum(CampaignBudgetType),
  limit: z.number(),
})

const UpdateCampaignBudget = z.object({
  type: z.nativeEnum(CampaignBudgetType).optional(),
  limit: z.number().optional(),
})

export type AdminCreateCampaignType = z.infer<typeof AdminCreateCampaign>
export const AdminCreateCampaign = z.object({
  name: z.string(),
  campaign_identifier: z.string(),
  description: z.string().optional(),
  currency: z.string().optional(),
  budget: CreateCampaignBudget.optional(),
  starts_at: z.coerce.date().optional(),
  ends_at: z.coerce.date().optional(),
  promotions: z.array(z.object({ id: z.string() })).optional(),
})

export type AdminUpdateCampaignType = z.infer<typeof AdminUpdateCampaign>
export const AdminUpdateCampaign = z.object({
  name: z.string().optional(),
  campaign_identifier: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
  budget: UpdateCampaignBudget.optional(),
  starts_at: z.coerce.date().optional(),
  ends_at: z.coerce.date().optional(),
  promotions: z.array(z.object({ id: z.string() })).optional(),
})
