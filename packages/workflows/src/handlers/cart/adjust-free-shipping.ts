import { WorkflowArguments } from "../../helper"

export async function adjustFreeShippingOnCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  cart: any
}>) {
  const { manager } = context

  const { cart } = data

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.adjustFreeShipping(cart, true)
}

adjustFreeShippingOnCart.aliases = {
  cart: "cart",
}
