import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { ProductTypeListTable } from "./components/product-type-list-table"

export const ProductTypeList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_type.list.after"),
        before: getWidgets("product_type.list.before"),
      }}
    >
      <ProductTypeListTable />
    </SingleColumnPage>
  )
}
