import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ConfigurableInventoryListTable } from "./components/configurable-inventory-list-table"
import { InventoryListTable } from "./components/inventory-list-table"

export const InventoryItemListTable = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="inventory_item.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="InventoryListTable">
              {isViewConfigEnabled ? (
                <ConfigurableInventoryListTable />
              ) : (
                <InventoryListTable />
              )}
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
