import { CampaignBudgetType, isPresent } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

/**
 * Validation schema for retrieving a single campaign.
 */
export const AdminGetCampaignParams = createSelectParams()

/**
 * Validation schema for campaign query parameters.
 */
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

/**
 * Type definition for campaign listing query parameters.
 */
export type AdminGetCampaignsParamsType = z.infer<
  typeof AdminGetCampaignsParams
>

/**
 * Validation schema for listing campaigns with pagination and filtering support.
 */
export const AdminGetCampaignsParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(AdminGetCampaignsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetCampaignsParamsFields).strict())

/**
 * Validation schema for creating campaign budget with type-specific validation rules.
 */
const CreateCampaignBudget = z
  .object({
    type: z.nativeEnum(CampaignBudgetType),
    limit: z.number().nullish(),
    currency_code: z.string().nullish(),
    attribute: z.string().nullish(),
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
  .refine(
    (data) =>
      isPresent(data.attribute) ||
      ![
        CampaignBudgetType.USE_BY_ATTRIBUTE,
        CampaignBudgetType.SPEND_BY_ATTRIBUTE,
      ].includes(data.type),
    {
      path: ["attribute"],
      message: `campaign budget attribute is required when budget type is USE_BY_ATTRIBUTE or SPEND_BY_ATTRIBUTE`,
    }
  )

/**
 * Validation schema for updating campaign budget.
 */
export const UpdateCampaignBudget = z
  .object({
    limit: z.number().nullish(),
  })
  .strict()

/**
 * Type definition for creating a campaign.
 */
export type AdminCreateCampaignType = z.infer<typeof CreateCampaign>

/**
 * Validation schema for creating a campaign.
 */
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

/**
 * Extended validation schema for creating a campaign with additional data support.
 */
export const AdminCreateCampaign = WithAdditionalData(CreateCampaign)

/**
 * Type definition for updating a campaign.
 */
export type AdminUpdateCampaignType = z.infer<typeof UpdateCampaign>

/**
 * Validation schema for updating a campaign.
 */
export const UpdateCampaign = z.object({
  name: z.string().optional(),
  campaign_identifier: z.string().optional(),
  description: z.string().nullish(),
  budget: UpdateCampaignBudget.optional(),
  starts_at: z.coerce.date().nullish(),
  ends_at: z.coerce.date().nullish(),
})

/**
 * Extended validation schema for updating a campaign with additional data support.
 */
export const AdminUpdateCampaign = WithAdditionalData(UpdateCampaign)
