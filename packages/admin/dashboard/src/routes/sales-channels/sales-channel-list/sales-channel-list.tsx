import { SalesChannelListTable } from "./components/sales-channel-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"

export const SalesChannelList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("sales_channel.list.before"),
        after: getWidgets("sales_channel.list.after"),
      }}
      hasOutlet
    >
      <SalesChannelListTable />
    </SingleColumnPage>
  )
}
