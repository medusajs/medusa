import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ProductTypeListTable } from "./components/product-type-list-table"

export const ProductTypeList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="product_type.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductTypeListTable">
            <ProductTypeListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
