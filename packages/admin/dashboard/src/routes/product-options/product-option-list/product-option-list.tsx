import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ProductOptionListTable } from "./components/product-option-list-table"

export const ProductOptionList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="product_option.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductOptionListTable">
            <ProductOptionListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
