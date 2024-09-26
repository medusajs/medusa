import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { ProductTypeListTable } from "./components/product-type-list-table"

export const ProductTypeList = () => {
  const { getWidgets } = useMedusaApp()

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
