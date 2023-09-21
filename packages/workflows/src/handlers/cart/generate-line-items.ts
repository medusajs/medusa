import { ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  items: (Partial<ProductVariantDTO> & {
    quantity: number
    unit_price?: number
  })[]
  cart: {
    id: string
    customer_id: string
    region_id: string
  }
}

enum Aliases {
  items = "items",
  cart = "cart",
}

export async function generateLineItems({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const { manager } = context

  const { items, cart } = data

  const lineItemService = container.resolve("lineItemService")
  const lineItemServiceTx = lineItemService.withTransaction(manager)

  return await lineItemServiceTx.generate(items, {
    region_id: cart.region_id,
    customer_id: cart.customer_id,
  })
}

generateLineItems.aliases = Aliases
