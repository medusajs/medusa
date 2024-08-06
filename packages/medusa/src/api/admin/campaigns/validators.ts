import { CampaignBudgetType, isPresent } from "@medusajs/utils"
import { z, ZodObject } from "zod"
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

const CreateCampaignBudget = z
  .object({
    type: z.nativeEnum(CampaignBudgetType),
    limit: z.number().nullish(),
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
    limit: z.number().nullish(),
  })
  .strict()

export type AdminCreateCampaignType = z.infer<typeof CreateCampaign>
export const CreateCampaign = z
  .object({
    name: z.string(),
    campaign_identifier: z.string(),
    description: z.string().nullish(),
    budget: CreateCampaignBudget.nullish(),
    starts_at: z.coerce.date().nullish(),
    ends_at: z.coerce.date().nullish(),
    promotions: z.array(z.object({ id: z.string() })).optional(),
  })
  .strict()
export const AdminCreateCampaign = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return CreateCampaign.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return CreateCampaign.extend({
    additional_data: additionalDataValidator,
  })
}

export type AdminUpdateCampaignType = z.infer<typeof UpdateCampaign>
export const UpdateCampaign = z.object({
  name: z.string().optional(),
  campaign_identifier: z.string().optional(),
  description: z.string().nullish(),
  budget: UpdateCampaignBudget.optional(),
  starts_at: z.coerce.date().nullish(),
  ends_at: z.coerce.date().nullish(),
  promotions: z.array(z.object({ id: z.string() })).optional(),
})
export const AdminUpdateCampaign = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return UpdateCampaign.extend({
      additional_data: z.record(z.unknown()).nullish(),
    })
  }

  return UpdateCampaign.extend({
    additional_data: additionalDataValidator,
  })
}
