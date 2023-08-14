import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  cart: CartDTO
}

export async function adjustFreeShippingOnCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const { manager } = context

  const { cart } = data

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.adjustFreeShipping(cart, true)
}

adjustFreeShippingOnCart.aliases = {
  cart: "cart",
}
