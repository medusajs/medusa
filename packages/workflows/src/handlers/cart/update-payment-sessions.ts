import { WorkflowArguments } from "../../helper"

export async function updatePaymentSessions({
  container,
  context,
  data,
}: WorkflowArguments<{
  cart: any
}>) {
  const { manager } = context

  const { cart } = data

  const cartService = container.resolve("cartService").withTransaction(manager)
  await cartService.selectAndCreatePaymentSessions(cart)
}

updatePaymentSessions.aliases = {
  cart: "cart",
}
