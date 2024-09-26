import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { CampaignListTable } from "./components/campaign-list-table"

export const CampaignList = () => {
  const { getWidgets } = useMedusaApp()

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
