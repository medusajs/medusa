import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ProductTagListTable } from "./components/product-tag-list-table"
import { ConfigurableProductTagListTable } from "./components/product-tag-list-table/configurable-product-tag-list-table"

export const ProductTagList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="product_tag.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductTagListTable">
            {isViewConfigEnabled ? (
              <ConfigurableProductTagListTable />
            ) : (
              <ProductTagListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
