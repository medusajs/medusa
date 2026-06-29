import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { PriceListListTable } from "./components/price-list-list-table"

export const PriceListList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="price_list.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="PriceListListTable">
            <PriceListListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
