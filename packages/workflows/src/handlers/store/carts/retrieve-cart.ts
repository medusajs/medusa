import { WorkflowArguments } from "../../../helper"

export async function retrieveCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
}>) {
  const { manager } = context

  const { input } = data

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cartWithTotals = await cartService.retrieveWithTotals(input.cart.id, {
    relations: [
      "items.variant.product.profiles",
      "items.adjustments",
      "discounts.rule",
      "gift_cards",
      "shipping_methods.shipping_option",
      "billing_address",
      "shipping_address",
      "region",
      "region.tax_rates",
      "region.payment_providers",
      "payment_sessions",
      "customer",
    ],
  })

  return {
    alias: "cart",
    value: cartWithTotals,
  }
}
