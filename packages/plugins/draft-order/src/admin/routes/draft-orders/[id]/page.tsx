import { Fragment } from "react"
import {
  LoaderFunctionArgs,
  Outlet,
  UIMatch,
  useParams,
} from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { PageSkeleton } from "../../../components/common/page-skeleton"
import { ActiveOrderChange } from "../../../components/draft-orders/active-order-changes"
import { ActivitySection } from "../../../components/draft-orders/activity-section"
import { CustomerSection } from "../../../components/draft-orders/customer-section"
import { GeneralSection } from "../../../components/draft-orders/general-section"
import { JsonViewSection } from "../../../components/draft-orders/json-view-section"
import { MetadataSection } from "../../../components/draft-orders/metadata-section"
import { ShippingSection } from "../../../components/draft-orders/shipping-section"
import { SummarySection } from "../../../components/draft-orders/summary-section"
import { useOrder, useOrderChanges } from "../../../hooks/api/orders"
import { sdk } from "../../../lib/queries/sdk"

type AdminDraftOrderSummary = HttpTypes.AdminOrder & {
  promotions: HttpTypes.AdminPromotion[]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params

  const data = await sdk.admin.order.retrieve(id!, {
    fields: "id,display_id",
  })

  return data
}

export const handle = {
  breadcrumb: (match: UIMatch<HttpTypes.AdminOrderResponse>) =>
    `#${match.data.order.display_id}`,
}

const ID = () => {
  const { id } = useParams()

  const { order, isPending, isError, error } = useOrder(id!, {
    fields:
      "+customer.*,+sales_channel.*,+region.*,+email,+items.*,+items.variant.*,+items.variant.product.*,+items.variant.product.shipping_profile.*,+items.variant.options.*,+currency_code,+promotions.*",
  })

  const {
    order_changes,
    isPending: isOrderChangesPending,
    isError: isOrderChangesError,
    error: orderChangesError,
  } = useOrderChanges(id!, {
    change_type: ["edit", "transfer", "update_order"],
  })

  if (isError) {
    throw error
  }

  if (isOrderChangesError) {
    throw orderChangesError
  }

  const isReady =
    !isPending && !isOrderChangesPending && !!order && !!order_changes

  if (!isReady) {
    return (
      <PageSkeleton
        mainSections={3}
        sidebarSections={2}
        showJSON
        showMetadata
      />
    )
  }

  return (
    <Fragment>
      <div className="flex w-full flex-col gap-y-3">
        <div className="flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]">
          <div className="flex w-full min-w-0 flex-col gap-y-3">
            <ActiveOrderChange orderId={order.id} />
            <GeneralSection order={order} />
            <SummarySection order={order as AdminDraftOrderSummary} />
            <ShippingSection order={order} />
            <div className="hidden flex-col gap-y-3 xl:flex">
              <MetadataSection order={order} />
              <JsonViewSection data={order} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-3 xl:mt-0">
            <CustomerSection order={order} />
            <ActivitySection order={order} changes={order_changes} />
            <div className="flex flex-col gap-y-3 xl:hidden">
              <MetadataSection order={order} />
              <JsonViewSection data={order} />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  )
}

export default ID