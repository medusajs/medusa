import {
  LoaderFunctionArgs,
  UIMatch,
  useParams,
} from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { ActiveOrderChange } from "../../../components/draft-orders/active-order-changes"
import { ActivitySection } from "../../../components/draft-orders/activity-section"
import { CustomerSection } from "../../../components/draft-orders/customer-section"
import { GeneralSection } from "../../../components/draft-orders/general-section"
import { ShippingSection } from "../../../components/draft-orders/shipping-section"
import { SummarySection } from "../../../components/draft-orders/summary-section"
import { useOrder, useOrderChanges } from "../../../hooks/api/orders"
import { sdk } from "../../../lib/queries/sdk"
import { TwoColumnPage, TwoColumnPageSkeleton } from "@medusajs/dashboard/components"
import { useExtension } from "@medusajs/dashboard/hooks"

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

  const { getWidgets } = useExtension()

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
      <TwoColumnPageSkeleton
        mainSections={4}
        sidebarSections={2}
        showJSON
        showMetadata
      />
    )
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("draft-order.details.after"),
        before: getWidgets("draft-order.details.before"),
        sideAfter: getWidgets("draft-order.details.side.after"),
        sideBefore: getWidgets("draft-order.details.side.before"),
      }}
      hasOutlet
      showJSON
      showMetadata
      data={order}
    >
      <TwoColumnPage.Main>
        <ActiveOrderChange orderId={order.id} />
        <GeneralSection order={order} />
        <SummarySection order={order as AdminDraftOrderSummary} />
        <ShippingSection order={order} />
      </TwoColumnPage.Main>

      <TwoColumnPage.Sidebar>
        <CustomerSection order={order} />
        <ActivitySection order={order} changes={order_changes} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}

export default ID
