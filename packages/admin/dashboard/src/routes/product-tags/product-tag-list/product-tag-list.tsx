import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ProductTagListTable } from "./components/product-tag-list-table"

export const ProductTagList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="product_tag.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ProductTagListTable">
            <ProductTagListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
