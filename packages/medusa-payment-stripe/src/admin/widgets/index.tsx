import { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin"
import { useAdminCustomQuery } from "medusa-react"
import { ListStripeIntentRes } from "../../types"
import { Container, Heading } from "@medusajs/ui"
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
    <Container title="Stripe Payments">
      <Heading
        level="h1"
        className="flex items-center gap-x-4 text-2xl font-semibold"
      >
        <span>Stripe Payments</span>
        <StripeLogo />
      </Heading>
      <div className="py-large flex flex-col">
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
