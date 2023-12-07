import { CartWorkflow } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk";

type HandlerInputData = {
  line_items: {
    items?: CartWorkflow.CreateLineItemInputDTO[]
  }
  cart: {
    id: string
    customer_id: string
    region_id: string
  }
}

enum Aliases {
  LineItems = "line_items",
  Cart = "cart",
}

export async function generateLineItems({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>) {
  const { manager } = context
  const lineItemService = container.resolve("lineItemService")
  const lineItems = data[Aliases.LineItems].items
  const cart = data[Aliases.Cart]

  if (!lineItems?.length) {
    return
  }

  const generateInputData = lineItems.map((item) => ({
    variantId: item.variant_id,
    quantity: item.quantity,
  }))

  const items = await lineItemService
    .withTransaction(manager)
    .generate(generateInputData, {
      region_id: cart.region_id,
      customer_id: cart.customer_id,
    })

  return items.map((i) => {
    return { ...i, cart_id: cart.id, has_shipping: false }
  })
}

generateLineItems.aliases = Aliases
