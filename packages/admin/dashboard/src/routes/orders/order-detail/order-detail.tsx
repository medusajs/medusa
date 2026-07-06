import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
            <LayoutComposer.Entry id="OrderActiveEditSection">
              <OrderActiveEditSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ActiveOrderClaimSection">
              <ActiveOrderClaimSection orderPreview={orderPreview!} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ActiveOrderExchangeSection">
              <ActiveOrderExchangeSection orderPreview={orderPreview!} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ActiveOrderReturnSection">
              <ActiveOrderReturnSection orderPreview={orderPreview!} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="OrderGeneralSection">
              <OrderGeneralSection order={order as ExtendedOrder} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="OrderSummarySection">
              <OrderSummarySection order={order} plugins={plugins} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="OrderPaymentSection">
              <OrderPaymentSection
                order={order as ExtendedOrder}
                plugins={plugins}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="OrderFulfillmentSection">
              <OrderFulfillmentSection order={order as ExtendedOrder} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(order)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="OrderCustomerSection">
              <OrderCustomerSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="OrderActivitySection">
              <OrderActivitySection order={order as ExtendedOrder} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
