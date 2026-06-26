import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { usePlugins } from "../../../hooks/api/plugins"
import { ActiveOrderClaimSection } from "./components/active-order-claim-section"
import { ActiveOrderExchangeSection } from "./components/active-order-exchange-section"
import { ActiveOrderReturnSection } from "./components/active-order-return-section"
import { OrderActiveEditSection } from "./components/order-active-edit-section"
import { OrderActivitySection } from "./components/order-activity-section"
import { OrderCustomerSection } from "./components/order-customer-section"
import { OrderFulfillmentSection } from "./components/order-fulfillment-section"
import { OrderGeneralSection } from "./components/order-general-section"
import { OrderPaymentSection } from "./components/order-payment-section"
import { OrderSummarySection } from "./components/order-summary-section"
import { DEFAULT_FIELDS, ExtendedOrder } from "./constants"
import { orderLoader } from "./loader"

export const OrderDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof orderLoader>>

  const { id } = useParams()
  const { plugins = [] } = usePlugins()

  const { order, isLoading, isError, error } = useOrder(
    id!,
    {
      fields: DEFAULT_FIELDS,
    },
    {
      initialData,
    }
  )

  // TODO: Retrieve endpoints don't have an order ability, so a JS sort until this is available
  if (order) {
    order.items = order.items.sort((itemA: any, itemB: any) => {
      if (itemA.created_at > itemB.created_at) {
        return 1
      }

      if (itemA.created_at < itemB.created_at) {
        return -1
      }

      return 0
    })
  }

  const { order: orderPreview, isLoading: isPreviewLoading } = useOrderPreview(
    id!
  )

  if (isLoading || !order || isPreviewLoading) {
    return (
      <TwoColumnPageSkeleton mainSections={4} sidebarSections={2} showJSON />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="order.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={order}
      sections={{
        main: (
          <>
            <OrderActiveEditSection order={order} />
            <ActiveOrderClaimSection orderPreview={orderPreview!} />
            <ActiveOrderExchangeSection orderPreview={orderPreview!} />
            <ActiveOrderReturnSection orderPreview={orderPreview!} />
            <OrderGeneralSection order={order as ExtendedOrder} />
            <OrderSummarySection order={order} plugins={plugins} />
            <OrderPaymentSection
              order={order as ExtendedOrder}
              plugins={plugins}
            />
            <OrderFulfillmentSection order={order as ExtendedOrder} />
            <MetadataSection data={order} />
            <JsonViewSection data={order} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <OrderCustomerSection order={order} />
            <OrderActivitySection order={order as ExtendedOrder} />
          </>
        ),
      }}
    />
  )
}
