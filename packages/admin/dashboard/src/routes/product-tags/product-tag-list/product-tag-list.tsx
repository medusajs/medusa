import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { ProductTagListTable } from "./components/product-tag-list-table"

export const ProductTagList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      showMetadata={false}
      showJSON={false}
      hasOutlet
      widgets={{
        after: getWidgets("product_tag.list.after"),
        before: getWidgets("product_tag.list.before"),
      }}
    >
      <ProductTagListTable />
    </SingleColumnPage>
  )
}
