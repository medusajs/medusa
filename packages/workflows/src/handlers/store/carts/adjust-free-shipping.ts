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

  const cartWithTotals = await cartService.retrieveWithTotals(cart.id, {
    relations: [
      "discounts",
      "discounts.rule",
      "shipping_methods",
      "shipping_methods.shipping_option",
    ],
  })

  if (
    cartWithTotals.discounts.some(({ rule }) => rule.type === "free_shipping")
  ) {
    await cartService.adjustFreeShipping_(cartWithTotals, true)
  }
}

adjustFreeShippingOnCart.aliases = {
  input: "input",
}
