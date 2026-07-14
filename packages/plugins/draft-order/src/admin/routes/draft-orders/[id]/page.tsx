import { LoaderFunctionArgs, UIMatch, useParams } from "react-router-dom"

import { LayoutComposer } from "@medusajs/dashboard/components"
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
    <LayoutComposer
      widgetsZonePrefix="draft_order.details"
      preferredLayoutId="core:two-column"
      data={order}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ActiveOrderChange">
              <ActiveOrderChange orderId={order.id} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="GeneralSection">
              <GeneralSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="SummarySection">
              <SummarySection order={order as AdminDraftOrderSummary} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ShippingSection">
              <ShippingSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="MetadataSection">
              <MetadataSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="JsonViewSection">
              <JsonViewSection data={order} />
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="CustomerSection">
              <CustomerSection order={order} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ActivitySection">
              <ActivitySection order={order} changes={order_changes} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

export default ID
