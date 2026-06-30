import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { PromotionListTable } from "./components/promotion-list-table"

export const PromotionsList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="promotion.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PromotionListTable">
            <PromotionListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
