import { Order } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { OrderNoteForm } from "./order-note-form"
import { OrderTimeline } from "./order-timeline"

type OrderActivityProps = {
  order: Order
}

export const OrderActivitySection = ({ order }: OrderActivityProps) => {
  return (
    <Container className="flex flex-col gap-y-8 px-6 py-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Activity</Heading>
        </div>
        <OrderNoteForm order={order} />
      </div>
      <OrderTimeline order={order} />
    </Container>
  )
}
