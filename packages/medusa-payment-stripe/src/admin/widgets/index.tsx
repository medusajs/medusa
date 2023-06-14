import React from "react"
import { WidgetConfig } from "@medusajs/admin"
import { Container } from "../shared/components/container"
import { useAdminEntity } from "../shared/hooks"
import { ListStripeIntentRes } from "../../types"
import Table from "../shared/components/table"
import StripeLogo from "../shared/icons/stripe-logo"
import { Order } from "@medusajs/medusa"

const MyWidget = (props: { order: Order }) => {
  const { order } = props
  const { data } = useAdminEntity<ListStripeIntentRes>(props.order.id)

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
