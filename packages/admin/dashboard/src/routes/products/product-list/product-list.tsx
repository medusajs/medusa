import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ProductListTable } from "./components/product-list-table"
import { ConfigurableProductListTable } from "./components/product-list-table/configurable-product-list-table"

export const ProductList = () => {
  const { getWidgets } = useExtension()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product.list.after"),
        before: getWidgets("product.list.before"),
      }}
    >
      {isViewConfigEnabled ? (
        <ConfigurableProductListTable />
      ) : (
        <ProductListTable />
      )}
    </SingleColumnPage>
  )
}
