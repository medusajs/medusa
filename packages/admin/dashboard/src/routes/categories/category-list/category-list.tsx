import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { CategoryListTable } from "./components/category-list-table"

export const CategoryList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_category.list.after"),
        before: getWidgets("product_category.list.before"),
      }}
      hasOutlet
    >
      <CategoryListTable />
    </SingleColumnPage>
  )
}
