import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { CollectionListTable } from "./components/collection-list-table"

export const CollectionList = () => {
  const { getWidgets } = useDashboardExtension()

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
