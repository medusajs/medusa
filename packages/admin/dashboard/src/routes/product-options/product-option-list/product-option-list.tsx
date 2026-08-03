import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ProductOptionListTable } from "./components/product-option-list-table"
import { ConfigurableProductOptionListTable } from "./components/product-option-list-table/configurable-product-option-list-table"

export const ProductOptionList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="product_option.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductOptionListTable">
            {isViewConfigEnabled ? (
              <ConfigurableProductOptionListTable />
            ) : (
              <ProductOptionListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
