import { SingleColumnPage } from "../../../components/layout/pages"
import { ProductTagListTable } from "./components/product-tag-list-table"

export const ProductTagList = () => {
  return (
    <SingleColumnPage
      showMetadata={false}
      showJSON={false}
      hasOutlet
      widgets={{
        after: { widgets: [] },
        before: { widgets: [] },
      }}
    >
      <ProductTagListTable />
    </SingleColumnPage>
  )
}
