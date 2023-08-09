import { WorkflowArguments } from "../../helper"

export async function adjustFreeShippingOnCart({
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

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.adjustFreeShipping(cart, true)
}

adjustFreeShippingOnCart.aliases = {
  input: "input",
}
