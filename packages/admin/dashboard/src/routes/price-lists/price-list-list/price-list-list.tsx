import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { PriceListListTable } from "./components/price-list-list-table"

export const PriceListList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("price_list.list.after"),
        before: getWidgets("price_list.list.before"),
      }}
    >
      <PriceListListTable />
    </SingleColumnPage>
  )
}
