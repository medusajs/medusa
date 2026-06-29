import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { TaxRegionListView } from "./components/tax-region-list-view"

export const TaxRegionsList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="tax.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="TaxRegionListView">
            <TaxRegionListView />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
