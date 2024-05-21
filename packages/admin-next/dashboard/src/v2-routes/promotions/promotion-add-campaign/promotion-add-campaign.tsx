import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useCampaigns } from "../../../hooks/api/campaigns"
import { usePromotion } from "../../../hooks/api/promotions"
import { AddCampaignPromotionForm } from "./components/add-campaign-promotion-form"

export const PromotionAddCampaign = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { promotion, isPending, isError, error } = usePromotion(id!)

  let campaignQuery = {}

  if (promotion?.application_method?.currency_code) {
    campaignQuery = {
      budget: {
        currency_code: promotion?.application_method?.currency_code,
      },
    }
  }

  const {
    campaigns,
    isPending: areCampaignsLoading,
    isError: isCampaignError,
    error: campaignError,
  } = useCampaigns(campaignQuery)

  if (isError || isCampaignError) {
    throw error || campaignError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("promotions.addToCampaign.title")}</Heading>
      </RouteDrawer.Header>

      {!isPending && !areCampaignsLoading && promotion && campaigns && (
        <AddCampaignPromotionForm promotion={promotion} campaigns={campaigns} />
      )}
    </RouteDrawer>
  )
}
