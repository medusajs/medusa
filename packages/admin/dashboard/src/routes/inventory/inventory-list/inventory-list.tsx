import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { InventoryListTable } from "./components/inventory-list-table"

export const InventoryItemListTable = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="inventory_item.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="InventoryListTable">
              <InventoryListTable />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
