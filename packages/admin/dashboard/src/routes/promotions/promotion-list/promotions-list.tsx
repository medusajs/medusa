import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PromotionListTable } from "./components/promotion-list-table"
import { ConfigurablePromotionListTable } from "./components/promotion-list-table/configurable-promotion-list-table"

export const PromotionsList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="promotion.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PromotionListTable">
            {isViewConfigEnabled ? (
              <ConfigurablePromotionListTable />
            ) : (
              <PromotionListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
