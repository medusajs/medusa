import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { usePromotion, usePromotionRules } from "../../../hooks/api/promotions"
import { CampaignSection } from "./components/campaign-section"
import { PromotionConditionsSection } from "./components/promotion-conditions-section"
import { PromotionGeneralSection } from "./components/promotion-general-section"
import { promotionLoader } from "./loader"

import after from "virtual:medusa/widgets/promotion/details/after"
import before from "virtual:medusa/widgets/promotion/details/before"

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
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={promotion} />
          </div>
        )
      })}
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
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={promotion} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={promotion} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          <CampaignSection campaign={promotion.campaign!} />
          <div className="xl:hidden">
            <JsonViewSection data={promotion} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
