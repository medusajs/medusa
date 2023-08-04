import { WorkflowArguments } from "../../../helper"

export async function adjustFreeShippingOnCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
}>) {
  const { transactionManager: manager } = context

  const { cart } = data.input

  const cartService = container.resolve("cartService").withTransaction(manager)

  // Required relations
  // "discounts",
  // "discounts.rule",
  // "shipping_methods",
  // "shipping_methods.shipping_option",

  await cartService.adjustFreeShipping(cart, true)
}

adjustFreeShippingOnCart.aliases = {
  input: "input",
}
