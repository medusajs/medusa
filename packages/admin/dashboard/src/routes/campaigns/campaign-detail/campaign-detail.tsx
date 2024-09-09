import { useLoaderData, useParams } from "react-router-dom"

import { useCampaign } from "../../../hooks/api/campaigns"
import { CampaignBudget } from "./components/campaign-budget"
import { CampaignGeneralSection } from "./components/campaign-general-section"
import { CampaignPromotionSection } from "./components/campaign-promotion-section"
import { CampaignSpend } from "./components/campaign-spend"
import { campaignLoader } from "./loader"

import after from "virtual:medusa/widgets/campaign/details/after"
import before from "virtual:medusa/widgets/campaign/details/before"
import sideAfter from "virtual:medusa/widgets/campaign/details/side/after"
import sideBefore from "virtual:medusa/widgets/campaign/details/side/before"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { CampaignConfigurationSection } from "./components/campaign-configuration-section"

export const CampaignDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof campaignLoader>
  >

  const { id } = useParams()
  const { campaign, isLoading, isError, error } = useCampaign(
    id!,
    { fields: "+promotions.id" },
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
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      hasOutlet
      showJSON
      showMetadata
      data={campaign}
    >
      <TwoColumnPage.Main>
        <CampaignGeneralSection campaign={campaign} />
        <CampaignPromotionSection campaign={campaign} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <CampaignConfigurationSection campaign={campaign} />
        <CampaignSpend campaign={campaign} />
        <CampaignBudget campaign={campaign} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
