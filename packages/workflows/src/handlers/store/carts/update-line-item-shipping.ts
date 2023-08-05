import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type UpdateLineItemsShippingInputData =
  WorkflowTypes.CartTypes.EnsureCorrectLineItemShippingDTO

export async function ensureCorrectLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
}>) {
  const { manager } = context

  const { cart } = data.input

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    cart.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: lineItemService.validateLineItemShipping_(
          cart.methods,
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
