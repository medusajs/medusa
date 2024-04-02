import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useV2Campaigns } from "../../../lib/api-v2/campaign"
import { useV2Promotion } from "../../../lib/api-v2/promotion"
import { AddCampaignPromotionForm } from "./components/add-campaign-promotion-form"

export const PromotionAddCampaign = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { promotion, isLoading, isError, error } = useV2Promotion(id!)
  const {
    campaigns,
    isLoading: areCampaignsLoading,
    isError: isCampaignError,
    error: campaignError,
  } = useV2Campaigns()

  if (isError) {
    throw error
  }

  if (isCampaignError) {
    throw campaignError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("promotions.addToCampaign.title")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && !areCampaignsLoading && promotion && campaigns && (
        <AddCampaignPromotionForm promotion={promotion} campaigns={campaigns} />
      )}
    </RouteDrawer>
  )
}
