import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { TaxRegionListView } from "./components/tax-region-list-view"

export const TaxRegionsList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("tax.list.before"),
        after: getWidgets("tax.list.after"),
      }}
      hasOutlet
    >
      <TaxRegionListView />
    </SingleColumnPage>
  )
}
