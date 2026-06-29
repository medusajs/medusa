import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { SalesChannelListTable } from "./components/sales-channel-list-table"

export const SalesChannelList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="sales_channel.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="SalesChannelListTable">
            <SalesChannelListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
