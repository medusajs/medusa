import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { RegionListTable } from "./components/region-list-table"

export const RegionList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="region.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="RegionListTable">
            <RegionListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
