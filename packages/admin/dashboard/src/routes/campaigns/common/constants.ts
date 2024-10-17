import { CampaignBudgetTypeValues } from "@medusajs/types"

export const DEFAULT_CAMPAIGN_VALUES = {
  name: "",
  description: "",
  campaign_identifier: "",
  starts_at: null,
  ends_at: null,
  budget: {
    type: "usage" as CampaignBudgetTypeValues,
    currency_code: null,
    limit: null,
  },
}
