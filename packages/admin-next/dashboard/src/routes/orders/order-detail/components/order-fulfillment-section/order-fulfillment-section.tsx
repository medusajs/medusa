import { Fulfillment as MedusaFulfillment, Order } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"

type OrderFulfillmentSectionProps = {
  order: Order
}

export const OrderFulfillmentSection = ({
  order,
}: OrderFulfillmentSectionProps) => {
  const fulfillments = order.fulfillments || []

  const fulfillmentItems = fulfillments?.map((f) =>
    f.items.map((i) => ({ id: i.item_id, quantity: i.quantity }))
  )

  // Create an array of order items that haven't been fulfilled or at least not fully fulfilled
  const unfulfilledItems = order.items.filter(
    (i) =>
      !fulfillmentItems?.some((fi) =>
        fi.some((f) => f.id === i.id && f.quantity === i.quantity)
      )
  )

  return (
    <div className="flex flex-col gap-y-2">
      <UnfulfilledItems order={order} />
      {fulfillments.map((f) => (
        <Fulfillment key={f.id} fulfillment={f} />
      ))}
    </div>
  )
}

const Placeholder = () => {
  return (
    <Container className="p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Fulfillment #1</Heading>
      </div>
    </Container>
  )
}

const UnfulfilledItems = ({ order }: { order: Order }) => {
  const fulfillmentItems = order.fulfillments?.map((f) =>
    f.items.map((i) => ({ id: i.item_id, quantity: i.quantity }))
  )

  // Create an array of order items that haven't been fulfilled or at least not fully fulfilled
  const unfulfilledItems = order.items.filter(
    (i) =>
      !fulfillmentItems?.some((fi) =>
        fi.some((f) => f.id === i.id && f.quantity === i.quantity)
      )
  )

  if (!unfulfilledItems.length) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Unfulfilled</Heading>
      </div>
    </Container>
  )
}

const Fulfillment = ({ fulfillment }: { fulfillment: MedusaFulfillment }) => {
  return <Container className="p-0"></Container>
}
