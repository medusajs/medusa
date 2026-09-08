import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { RegionListTable } from "./components/region-list-table"
import { ConfigurableRegionListTable } from "./components/region-list-table/configurable-region-list-table"

export const RegionList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="region.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="RegionListTable">
            {isViewConfigEnabled ? (
              <ConfigurableRegionListTable />
            ) : (
              <RegionListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
