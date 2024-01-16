export interface CreateCampaignDTO {
  name: string
  description?: string
  currency?: string
  campaign_identifier: string
  starts_at: Date
  ends_at: Date
}

export interface UpdateCampaignDTO {
  id: string
  name?: string
  description?: string
  currency?: string
  campaign_identifier?: string
  starts_at?: Date
  ends_at?: Date
}
