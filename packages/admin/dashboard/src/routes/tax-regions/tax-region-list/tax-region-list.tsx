import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { TaxRegionListView } from "./components/tax-region-list-view"

export const TaxRegionsList = () => {
  const { getWidgets } = useDashboardExtension()

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
