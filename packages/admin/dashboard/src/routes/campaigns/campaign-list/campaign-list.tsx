import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { CampaignListTable } from "./components/campaign-list-table"

export const CampaignList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("campaign.list.after"),
        before: getWidgets("campaign.list.before"),
      }}
      hasOutlet
    >
      <CampaignListTable />
    </SingleColumnPage>
  )
}
