import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useCampaign } from "../../../hooks/api/campaigns"
import { CampaignBudget } from "./components/campaign-budget"
import { CampaignGeneralSection } from "./components/campaign-general-section"
import { CampaignPromotionSection } from "./components/campaign-promotion-section"
import { CampaignSpend } from "./components/campaign-spend"
import { campaignLoader } from "./loader"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
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
    <LayoutComposer
      widgetsZonePrefix="campaign.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={campaign}
      sections={{
        main: (
          <>
            <CampaignGeneralSection campaign={campaign} />
            <CampaignPromotionSection campaign={campaign} />
            <MetadataSection data={campaign} />
            <JsonViewSection data={campaign} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <CampaignConfigurationSection campaign={campaign} />
            <CampaignSpend campaign={campaign} />
            <CampaignBudget campaign={campaign} />
          </>
        ),
      }}
    />
  )
}
