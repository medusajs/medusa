import { PromotionDTO } from "@medusajs/types"

export enum PromotionStatus {
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export const getPromotionStatus = (promotion: PromotionDTO) => {
  const date = new Date()
  const campaign = promotion.campaign

  if (!campaign) {
    return PromotionStatus.ACTIVE
  }

  if (new Date(campaign.starts_at!) > date) {
    return PromotionStatus.SCHEDULED
  }

  const campaignBudget = campaign.budget
  const overBudget =
    campaignBudget && campaignBudget.used! > campaignBudget.limit!

  if ((campaign.ends_at && new Date(campaign.ends_at) < date) || overBudget) {
    return PromotionStatus.EXPIRED
  }

  return PromotionStatus.ACTIVE
}
