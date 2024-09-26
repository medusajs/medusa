import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { CollectionListTable } from "./components/collection-list-table"

export const CollectionList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_collection.list.after"),
        before: getWidgets("product_collection.list.before"),
      }}
    >
      <CollectionListTable />
    </SingleColumnPage>
  )
}
