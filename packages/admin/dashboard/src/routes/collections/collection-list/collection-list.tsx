import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { CollectionListTable } from "./components/collection-list-table"
import { ConfigurableCollectionListTable } from "./components/collection-list-table/configurable-collection-list-table"

export const CollectionList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="product_collection.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CollectionListTable">
            {isViewConfigEnabled ? (
              <ConfigurableCollectionListTable />
            ) : (
              <CollectionListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
