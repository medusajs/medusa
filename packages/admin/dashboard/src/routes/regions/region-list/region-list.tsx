import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { RegionListTable } from "./components/region-list-table"

export const RegionList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("region.list.before"),
        after: getWidgets("region.list.after"),
      }}
    >
      <RegionListTable />
    </SingleColumnPage>
  )
}
