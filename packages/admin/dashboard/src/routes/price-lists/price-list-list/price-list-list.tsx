import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PriceListListTable } from "./components/price-list-list-table"
import { ConfigurablePriceListListTable } from "./components/price-list-list-table/configurable-price-list-list-table"

export const PriceListList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="price_list.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PriceListListTable">
            {isViewConfigEnabled ? (
              <ConfigurablePriceListListTable />
            ) : (
              <PriceListListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
