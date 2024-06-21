import { SingleColumnPage } from "../../../components/layout/pages"
import { TaxRegionListView } from "./components/tax-region-list-view"

import after from "virtual:medusa/widgets/tax/list/after"
import before from "virtual:medusa/widgets/tax/list/before"

export const TaxRegionsList = () => {
  return (
    <SingleColumnPage
      widgets={{
        before,
        after,
      }}
      hasOutlet
    >
      <TaxRegionListView />
    </SingleColumnPage>
  )
}
