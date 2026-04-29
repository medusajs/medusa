import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { usePromotion, usePromotionRules } from "../../../hooks/api/promotions"
import { useExtension } from "../../../providers/extension-provider"
import { CampaignSection } from "./components/campaign-section"
import { PromotionConditionsSection } from "./components/promotion-conditions-section"
import { PromotionGeneralSection } from "./components/promotion-general-section"
import { promotionLoader } from "./loader"
import { AdminPromotionRule } from "@medusajs/types"
import { BasePromotionRuleValue } from "@medusajs/types/dist/http/promotion/common"

export type ExtendedPromotionRule = Omit<AdminPromotionRule, "values"> & {
  attribute_label?: string
  operator_label?: string
  field_type?: string
  values?: (BasePromotionRuleValue & {
    label?: string
  })[]
}

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

  const { rules } = usePromotionRules(id!, "rules", query) as {
    rules: ExtendedPromotionRule[]
  }
  const { rules: targetRules } = usePromotionRules(
    id!,
    "target-rules",
    query
  ) as {
    rules: ExtendedPromotionRule[]
  }
  const { rules: buyRules } = usePromotionRules(id!, "buy-rules", query) as {
    rules: ExtendedPromotionRule[]
  }

  const { getWidgets } = useExtension()

  if (isLoading || !promotion) {
    return (
      <TwoColumnPageSkeleton mainSections={3} sidebarSections={1} showJSON />
    )
  }

  return (
    <TwoColumnPage
      data={promotion}
      widgets={{
        after: getWidgets("promotion.details.after"),
        before: getWidgets("promotion.details.before"),
        sideAfter: getWidgets("promotion.details.side.after"),
        sideBefore: getWidgets("promotion.details.side.before"),
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
          applicationMethodTargetType={
            promotion.application_method?.target_type || "items"
          }
        />
        {promotion.type === "buyget" && (
          <PromotionConditionsSection
            rules={buyRules || []}
            ruleType={"buy-rules"}
            applicationMethodTargetType={"items"}
          />
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <CampaignSection campaign={promotion.campaign!} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
