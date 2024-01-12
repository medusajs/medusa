export default async function handler({ data: { id }, container }) {
  const orderService = container.resolve("orderService")
  const cartService = container.resolve("cartService")
  const segmentService = container.resolve("segmentService")
  const order = await orderService.retrieveWithTotals(id, {
    relations: [
      "customer",
      "billing_address",
      "shipping_address",
      "discounts",
      "discounts.rule",
      "shipping_methods",
      "shipping_methods.shipping_option",
      "payments",
      "fulfillments",
      "items",
      "returns",
      "gift_cards",
      "gift_card_transactions",
      "swaps",
      "swaps.return_order",
      "swaps.payment",
      "swaps.shipping_methods",
      "swaps.shipping_methods.shipping_option",
      "swaps.shipping_address",
      "swaps.additional_items",
      "swaps.fulfillments",
    ],
  })

  const eventContext: Record<string, unknown> = {}
  const integrations: Record<string, unknown> = {}

  if (order.cart_id) {
    try {
      const cart = await cartService.retrieve(order.cart_id, {
        select: ["context"],
      })

      if (cart.context) {
        if (cart.context.ip) {
          eventContext.ip = cart.context.ip
        }

        if (cart.context.user_agent) {
          eventContext.user_agent = cart.context.user_agent
        }

        if (segmentService.options_ && segmentService.options_.use_ga_id) {
          if (cart.context.ga_id) {
            integrations["Google Analytics"] = {
              clientId: cart.context.ga_id,
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
      console.warn("Failed to gather context for order")
    }
  }

  const orderData = await segmentService.buildOrder(order)
  const orderEvent = {
    event: "Order Completed",
    userId: order.customer_id,
    properties: orderData,
    timestamp: order.created_at,
    context: eventContext,
    integrations,
  }

  segmentService.identify({
    userId: order.customer_id,
    traits: {
      email: order.email,
      firstName: order.shipping_address.first_name,
      lastName: order.shipping_address.last_name,
    },
  })

  segmentService.track(orderEvent)
}

export const config = {
  event: "order.placed",
}
