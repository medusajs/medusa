import { WorkflowArguments } from "../../../helper"

export async function cleanUpPaymentSessions({
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

  await cartService.cleanUpPaymentSessions(cart.id)
}

cleanUpPaymentSessions.aliases = {
  input: "input",
}
