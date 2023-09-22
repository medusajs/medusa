import { LineItemDTO, ProductVariantDTO } from "@medusajs/types"

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
  Items = "items",
  Cart = "cart",
}

export async function generateLineItems({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<LineItemDTO[]> {
  const { manager } = context

  const { items, cart } = data

  if (!items.length) {
    return []
  }

  const lineItemService = container.resolve("lineItemService")
  const lineItemServiceTx = lineItemService.withTransaction(manager)

  return await lineItemServiceTx.generate(items, {
    region_id: cart.region_id,
    customer_id: cart.customer_id,
  })
}

generateLineItems.aliases = Aliases
