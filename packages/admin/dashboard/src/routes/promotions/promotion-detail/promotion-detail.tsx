import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { usePromotion, usePromotionRules } from "../../../hooks/api/promotions"
import { CampaignSection } from "./components/campaign-section"
import { PromotionConditionsSection } from "./components/promotion-conditions-section"
import { PromotionGeneralSection } from "./components/promotion-general-section"
import { promotionLoader } from "./loader"

import after from "virtual:medusa/widgets/promotion/details/after"
import before from "virtual:medusa/widgets/promotion/details/before"
import sideAfter from "virtual:medusa/widgets/promotion/details/side/after"
import sideBefore from "virtual:medusa/widgets/promotion/details/side/before"

export const PromotionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof promotionLoader>
  >

  const { id } = useParams()
  const { promotion, isLoading } = usePromotion(id!, { initialData })
  const query: Record<string, string> = {}

  if (promotion?.type === "buyget") {
    query.promotion_type = promotion.type
  }

  const { rules } = usePromotionRules(id!, "rules", query)
  const { rules: targetRules } = usePromotionRules(id!, "target-rules", query)
  const { rules: buyRules } = usePromotionRules(id!, "buy-rules", query)

  if (isLoading || !promotion) {
    return (
      <TwoColumnPageSkeleton mainSections={3} sidebarSections={1} showJSON />
    )
  }

  return (
    <TwoColumnPage
      data={promotion}
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      hasOutlet
      showJSON
    >
      <TwoColumnPage.Main>
        <PromotionGeneralSection promotion={promotion} />
        <PromotionConditionsSection rules={rules || []} ruleType={"rules"} />
        <PromotionConditionsSection
          rules={targetRules || []}
          ruleType={"target-rules"}
        />
        {promotion.type === "buyget" && (
          <PromotionConditionsSection
            rules={buyRules || []}
            ruleType={"buy-rules"}
          />
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <CampaignSection campaign={promotion.campaign!} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
