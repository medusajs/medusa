import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { ProductOptionListTable } from "./components/product-option-list-table"

export const ProductOptionList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_option.list.after"),
        before: getWidgets("product_option.list.before"),
      }}
      hasOutlet
    >
      <ProductOptionListTable />
    </SingleColumnPage>
  )
}
