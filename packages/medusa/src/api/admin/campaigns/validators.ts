import { CampaignBudgetType, isPresent } from "@medusajs/framework/utils"
import { z } from "zod"
import {
  createFindParams,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const AdminGetCampaignParams = createSelectParams()

export const AdminGetCampaignsParamsFields = z
  .object({
    q: z.string().optional(),
    campaign_identifier: z.string().optional(),
    budget: z
      .object({
        currency_code: z.string().optional(),
      })
      .optional(),
  })
  .strict()

export type AdminGetCampaignsParamsType = z.infer<
  typeof AdminGetCampaignsParams
>
export const AdminGetCampaignsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminGetCampaignsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetCampaignsParamsFields).strict())

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
  })
  .strict()
export const AdminCreateCampaign = WithAdditionalData(CreateCampaign)

export type AdminUpdateCampaignType = z.infer<typeof UpdateCampaign>
export const UpdateCampaign = z.object({
  name: z.string().optional(),
  campaign_identifier: z.string().optional(),
  description: z.string().nullish(),
  budget: UpdateCampaignBudget.optional(),
  starts_at: z.coerce.date().nullish(),
  ends_at: z.coerce.date().nullish(),
})
export const AdminUpdateCampaign = WithAdditionalData(UpdateCampaign)
