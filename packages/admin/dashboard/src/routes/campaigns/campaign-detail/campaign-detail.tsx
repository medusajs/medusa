import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useCampaign } from "../../../hooks/api/campaigns"
import { CampaignBudget } from "./components/campaign-budget"
import { CampaignGeneralSection } from "./components/campaign-general-section"
import { CampaignPromotionSection } from "./components/campaign-promotion-section"
import { CampaignSpend } from "./components/campaign-spend"
import { campaignLoader } from "./loader"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
            <LayoutComposer.Entry id="CampaignGeneralSection">
              <CampaignGeneralSection campaign={campaign} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CampaignPromotionSection">
              <CampaignPromotionSection campaign={campaign} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(campaign)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="CampaignConfigurationSection">
              <CampaignConfigurationSection campaign={campaign} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CampaignSpend">
              <CampaignSpend campaign={campaign} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CampaignBudget">
              <CampaignBudget campaign={campaign} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
