import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { CollectionListTable } from "./components/collection-list-table"

export const CollectionList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="product_collection.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CollectionListTable">
            <CollectionListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
