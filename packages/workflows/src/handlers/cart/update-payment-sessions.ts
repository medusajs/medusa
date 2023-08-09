import { WorkflowArguments } from "../../helper"

export async function updatePaymentSessions({
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
  await cartService.selectAndCreatePaymentSessions(cart)
}

updatePaymentSessions.aliases = {
  input: "input",
}
