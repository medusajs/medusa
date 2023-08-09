import { WorkflowArguments } from "../../helper";

type HandlerInput = {
  cart: any
}

export async function ensureCorrectLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { manager } = context

  const { cart } = data

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    cart.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: lineItemService.validateLineItemShipping_(
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
