import {
  BigNumberInput,
  CampaignBudgetTypeValues,
  InferEntityType,
} from "@zjedene-medusa/framework/types"
import { Campaign } from "@models"

export interface CreateCampaignBudgetDTO {
  type?: CampaignBudgetTypeValues
  limit?: BigNumberInput | null
  currency_code?: string | null
  used?: BigNumberInput
  campaign?: InferEntityType<typeof Campaign> | string
}

export interface UpdateCampaignBudgetDTO {
  id: string
  type?: CampaignBudgetTypeValues
  limit?: BigNumberInput | null
  currency_code?: string | null
  used?: BigNumberInput
  usages?: CreateCampaignBudgetUsageDTO[]
}

export interface CreateCampaignBudgetUsageDTO {
  budget_id: string
  attribute_value: string
  used: BigNumberInput
}

export interface UpdateCampaignBudgetUsageDTO {
  id: string
  used: BigNumberInput
}
