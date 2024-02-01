import { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin"
import { useAdminCustomQuery } from "medusa-react"
import { ListStripeIntentRes } from "../../types"
import { Container } from "../shared/components/container"
import Table from "../shared/components/table"
import StripeLogo from "../shared/icons/stripe-logo"

const MyWidget = (props: OrderDetailsWidgetProps) => {
  const { order } = props
  const { data } = useAdminCustomQuery<{}, ListStripeIntentRes>(
    `/orders/stripe-payments/${order.id}`,
    ["admin_stripe"]
  )

  if (!order.payments.some((p) => p.provider_id === "stripe")) {
    return null
  }

  return (
    <Container title="Stripe Payments" icon={<StripeLogo />}>
      <div className="flex flex-col">
        {data && data?.payments?.length ? (
          <Table payments={data.payments} />
        ) : null}
      </div>
    </Container>
  )
}

export const config: WidgetConfig = {
  zone: "order.details.after",
}

export default MyWidget
