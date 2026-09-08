import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ProductTypeListTable } from "./components/product-type-list-table"
import { ConfigurableProductTypeListTable } from "./components/product-type-list-table/configurable-product-type-list-table"

export const ProductTypeList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="product_type.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductTypeListTable">
            {isViewConfigEnabled ? (
              <ConfigurableProductTypeListTable />
            ) : (
              <ProductTypeListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
