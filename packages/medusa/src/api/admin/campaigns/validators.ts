import { CampaignBudgetType, isPresent } from "@medusajs/utils"
import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const AdminGetCampaignParams = createSelectParams()

export type AdminGetCampaignsParamsType = z.infer<
  typeof AdminGetCampaignsParams
>
export const AdminGetCampaignsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(
    z.object({
      q: z.string().optional(),
      campaign_identifier: z.string().optional(),
      budget: z
        .object({
          currency_code: z.string().optional(),
        })
        .optional(),
      $and: z.lazy(() => AdminGetCampaignsParams.array()).optional(),
      $or: z.lazy(() => AdminGetCampaignsParams.array()).optional(),
    })
  )
  .strict()

export const CreateCampaignBudget = z
  .object({
    type: z.nativeEnum(CampaignBudgetType),
    limit: z.number().optional(),
    currency_code: z.string().nullish(),
  })
  .strict()
  .refine(
    (data) =>
      data.type !== CampaignBudgetType.SPEND || isPresent(data.currency_code),
    {
      path: ["currency_code"],
      message: `currency_code is required when budget type is ${CampaignBudgetType.SPEND}`,
    }
  )
  .refine(
    (data) =>
      data.type !== CampaignBudgetType.USAGE || !isPresent(data.currency_code),
    {
      path: ["currency_code"],
      message: `currency_code should not be present when budget type is ${CampaignBudgetType.USAGE}`,
    }
  )

export const UpdateCampaignBudget = z
  .object({
    limit: z.number().optional(),
  })
  .strict()

export type AdminCreateCampaignType = z.infer<typeof AdminCreateCampaign>
export const AdminCreateCampaign = z
  .object({
    name: z.string(),
    campaign_identifier: z.string(),
    description: z.string().nullish(),
    budget: CreateCampaignBudget.optional(),
    starts_at: z.coerce.date().nullish(),
    ends_at: z.coerce.date().nullish(),
    promotions: z.array(z.object({ id: z.string() })).optional(),
  })
  .strict()

export type AdminUpdateCampaignType = z.infer<typeof AdminUpdateCampaign>
export const AdminUpdateCampaign = z.object({
  name: z.string().optional(),
  campaign_identifier: z.string().optional(),
  description: z.string().nullish(),
  budget: UpdateCampaignBudget.optional(),
  starts_at: z.coerce.date().nullish(),
  ends_at: z.coerce.date().nullish(),
  promotions: z.array(z.object({ id: z.string() })).optional(),
})
