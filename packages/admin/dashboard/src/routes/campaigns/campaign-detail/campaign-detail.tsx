import { useLoaderData, useParams } from "react-router-dom"

import { useCampaign } from "../../../hooks/api/campaigns"
import { CampaignBudget } from "./components/campaign-budget"
import { CampaignGeneralSection } from "./components/campaign-general-section"
import { CampaignPromotionSection } from "./components/campaign-promotion-section"
import { CampaignSpend } from "./components/campaign-spend"
import { campaignLoader } from "./loader"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { CampaignConfigurationSection } from "./components/campaign-configuration-section"
import { CAMPAIGN_DETAIL_FIELDS } from "./constants"

export const CampaignDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof campaignLoader>
  >

  const { id } = useParams()
  const { campaign, isLoading, isError, error } = useCampaign(
    id!,
    { fields: CAMPAIGN_DETAIL_FIELDS },
    { initialData }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !campaign) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={3}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("campaign.details.after"),
        before: getWidgets("campaign.details.before"),
        sideAfter: getWidgets("campaign.details.side.after"),
        sideBefore: getWidgets("campaign.details.side.before"),
      }}
      hasOutlet
      showJSON
      showMetadata
      showRequiredPermissions
      data={campaign}
    >
      <TwoColumnPage.Main>
        <CampaignGeneralSection campaign={campaign} />
        <PermissionGuard permission="promotion:read">
          <CampaignPromotionSection campaign={campaign} />
        </PermissionGuard>
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <CampaignConfigurationSection campaign={campaign} />
        <CampaignSpend campaign={campaign} />
        <CampaignBudget campaign={campaign} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
