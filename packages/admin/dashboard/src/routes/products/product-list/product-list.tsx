import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ProductListTable } from "./components/product-list-table"
import { ConfigurableProductListTable } from "./components/product-list-table/configurable-product-list-table"

export const ProductList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="product.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: isViewConfigEnabled ? (
          <ConfigurableProductListTable />
        ) : (
          <ProductListTable />
        ),
      }}
    />
  )
}
