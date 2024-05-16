import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { usePromotion, usePromotionRules } from "../../../hooks/api/promotions"
import { CampaignSection } from "./components/campaign-section"
import { PromotionConditionsSection } from "./components/promotion-conditions-section"
import { PromotionGeneralSection } from "./components/promotion-general-section"
import { promotionLoader } from "./loader"

export const PromotionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof promotionLoader>
  >

  const { id } = useParams()
  const { promotion, isLoading } = usePromotion(id!, { initialData })
  const { rules } = usePromotionRules(id!, "rules")
  const { rules: targetRules } = usePromotionRules(id!, "target-rules")
  const { rules: buyRules } = usePromotionRules(id!, "buy-rules")

  if (isLoading || !promotion) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
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

          <div className="flex w-full flex-col gap-y-2 xl:hidden">
            <CampaignSection campaign={promotion.campaign!} />
          </div>

          <JsonViewSection data={promotion as any} />
        </div>

        <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
          <CampaignSection campaign={promotion.campaign!} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
