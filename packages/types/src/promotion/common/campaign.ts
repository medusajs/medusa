import { BaseFilterable } from "../../dal"
import {
  CampaignBudgetDTO,
  CreateCampaignBudgetDTO,
  UpdateCampaignBudgetDTO,
} from "./campaign-budget"

export interface CampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  campaign_budget?: CampaignBudgetDTO
}

export interface CreateCampaignDTO {
  name: string
  description?: string
  currency?: string
  campaign_identifier: string
  starts_at: Date
  ends_at: Date
  campaign_budget?: CreateCampaignBudgetDTO
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
  campaign_budget?: Omit<UpdateCampaignBudgetDTO, "id">
}

export interface FilterableCampaignProps
  extends BaseFilterable<FilterableCampaignProps> {
  id?: string[]
  campaign_identifier?: string[]
}
