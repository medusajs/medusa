import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { CategoryListTable } from "./components/category-list-table"

export const CategoryList = () => {
  const { getWidgets } = useDashboardExtension()

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
