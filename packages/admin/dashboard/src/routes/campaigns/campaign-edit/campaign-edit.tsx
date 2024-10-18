import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { VisuallyHidden } from "../../../components/utilities/visually-hidden"
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
        <RouteDrawer.Title asChild>
          <Heading>{t("campaigns.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <VisuallyHidden>{t("campaigns.edit.description")}</VisuallyHidden>
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {!isLoading && campaign && <EditCampaignForm campaign={campaign} />}
    </RouteDrawer>
  )
}
