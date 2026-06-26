import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { usePromotion, usePromotionRules } from "../../../hooks/api/promotions"
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

  if (isLoading || !promotion) {
    return (
      <TwoColumnPageSkeleton mainSections={3} sidebarSections={1} showJSON />
    )
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="promotion.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={promotion}
      sections={{
        main: (
          <>
            <PromotionGeneralSection promotion={promotion} />
            <PromotionConditionsSection
              rules={rules || []}
              ruleType={"rules"}
            />
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
            <JsonViewSection data={promotion} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <CampaignSection campaign={promotion.campaign!} />
          </>
        ),
      }}
    />
  )
}
