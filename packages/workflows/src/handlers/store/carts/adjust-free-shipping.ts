import { WorkflowArguments } from "../../../helper"

export async function adjustFreeShipping({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: any
}) {
  const { transactionManager: manager } = context

  const preparedData = data["preparedData"]

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(preparedData.cart.id, {
    relations: [
      "discounts",
      "discounts.rule",
      "shipping_methods",
      "shipping_methods.shipping_option",
    ],
  })

  if (cart.discounts.some(({ rule }) => rule.type === "free_shipping")) {
    await cartService.adjustFreeShipping_(cart, true)
  }
}
