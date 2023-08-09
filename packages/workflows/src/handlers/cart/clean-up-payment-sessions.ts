import { WorkflowArguments } from "../../helper"

export async function cleanUpPaymentSessions({
  container,
  context,
  data,
}: WorkflowArguments<{
  cart: any
}>) {
  const { manager } = context

  const { cart } = data

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.cleanUpPaymentSessions(cart.id)
}

cleanUpPaymentSessions.aliases = {
  input: "input",
}
