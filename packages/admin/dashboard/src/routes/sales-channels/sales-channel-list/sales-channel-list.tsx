import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { SalesChannelListTable } from "./components/sales-channel-list-table"
import { ConfigurableSalesChannelListTable } from "./components/configurable-sales-channel-list-table"

export const SalesChannelList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="sales_channel.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="SalesChannelListTable">
            {isViewConfigEnabled ? (
              <ConfigurableSalesChannelListTable />
            ) : (
              <SalesChannelListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
