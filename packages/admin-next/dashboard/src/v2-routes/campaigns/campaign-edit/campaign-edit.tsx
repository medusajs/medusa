import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useCampaign } from "../../../hooks/api/campaigns"
import { EditCampaignForm } from "./components/edit-campaign-form"

export const CampaignEdit = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { campaign, isLoading, isError, error } = useCampaign(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("campaigns.edit.header")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && campaign && <EditCampaignForm campaign={campaign} />}
    </RouteDrawer>
  )
}
