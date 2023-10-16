import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  cart: CartDTO
}

type HandlerOutput = {
  lineItems: any[]
}

export async function ensureCorrectLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<HandlerOutput> {
  const { manager } = context

  const { cart } = data

  if (!cart?.items?.length || !cart.shipping_methods?.length) {
    return {
      lineItems: [],
    }
  }

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const cartService = container.resolve("cartService").withTransaction(manager)

  const items = await Promise.all(
    cart.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: cartService.validateLineItemShipping_(
          cart.shipping_methods,
          item
        ),
      })
    })
  )

  return {
    lineItems: items,
  }
}

ensureCorrectLineItemShipping.aliases = {
  cart: "cart",
}
