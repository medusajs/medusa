import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { CategoryListTable } from "./components/category-list-table"

export const CategoryList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="product_category.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="CategoryListTable">
              <CategoryListTable />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
