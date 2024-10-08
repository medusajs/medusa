import { SalesChannelListTable } from "./components/sales-channel-list-table"

import after from "virtual:medusa/widgets/sales_channel/list/after"
import before from "virtual:medusa/widgets/sales_channel/list/before"
import { SingleColumnPage } from "../../../components/layout/pages"

export const SalesChannelList = () => {
  return (
    <SingleColumnPage
      widgets={{
        before,
        after,
      }}
      hasOutlet
    >
      <SalesChannelListTable />
    </SingleColumnPage>
  )
}
