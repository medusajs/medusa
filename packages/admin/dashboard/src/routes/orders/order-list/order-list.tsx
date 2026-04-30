import { OrderListTable } from "./components/order-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ConfigurableOrderListTable } from "./components/order-list-table/configurable-order-list-table"

export const OrderList = () => {
  const { getWidgets } = useExtension()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("order.list.after"),
        before: getWidgets("order.list.before"),
      }}
      hasOutlet={false}
    >
      {isViewConfigEnabled ? (
        <ConfigurableOrderListTable />
      ) : (
        <OrderListTable />
      )}
    </SingleColumnPage>
  )
}
