import { AdminCampaign } from "@medusajs/types"
import { isAfter, isBefore } from "date-fns"

export function campaignStatus(campaign: AdminCampaign) {
  if (campaign.ends_at) {
    if (isBefore(new Date(campaign.ends_at), new Date())) {
      return "expired"
    }
  }

  if (campaign.starts_at) {
    if (isAfter(new Date(campaign.starts_at), new Date())) {
      return "scheduled"
    }
  }

  return "active"
}

export const statusColor = (status: string) => {
  switch (status) {
    case "expired":
      return "red"
    case "scheduled":
      return "orange"
    case "active":
      return "green"
    default:
      return "grey"
  }
}
