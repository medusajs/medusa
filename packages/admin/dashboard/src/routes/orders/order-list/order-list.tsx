import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { OrderListTable } from "./components/order-list-table"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ConfigurableOrderListTable } from "./components/order-list-table/configurable-order-list-table"

export const OrderList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="order.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      hasOutlet={false}
      sections={{
        main: (
          <LayoutComposer.Entry id="OrderListTable">
            {isViewConfigEnabled ? (
              <ConfigurableOrderListTable />
            ) : (
              <OrderListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
