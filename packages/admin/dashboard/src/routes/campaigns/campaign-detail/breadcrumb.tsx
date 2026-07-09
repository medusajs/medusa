import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useCampaign } from "../../../hooks/api"
import { CAMPAIGN_DETAIL_FIELDS } from "./constants"

type CampaignDetailBreadcrumbProps = UIMatch<HttpTypes.AdminCampaignResponse>

export const CampaignDetailBreadcrumb = (
  props: CampaignDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { campaign } = useCampaign(
    id!,
    {
      fields: CAMPAIGN_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!campaign) {
    return null
  }

  return <span>{campaign.name}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminCampaignResponse>) => ({
  title: match.data?.campaign?.name,
})
