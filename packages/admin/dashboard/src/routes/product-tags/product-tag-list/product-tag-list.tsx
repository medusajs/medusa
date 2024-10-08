import { SingleColumnPage } from "../../../components/layout/pages"
import { ProductTagListTable } from "./components/product-tag-list-table"

import after from "virtual:medusa/widgets/product_tag/list/after"
import before from "virtual:medusa/widgets/product_tag/list/before"

export const ProductTagList = () => {
  return (
    <SingleColumnPage
      showMetadata={false}
      showJSON={false}
      hasOutlet
      widgets={{
        after,
        before,
      }}
    >
      <ProductTagListTable />
    </SingleColumnPage>
  )
}
