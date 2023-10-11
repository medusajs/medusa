import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  cart: CartDTO
}

export async function upsertPaymentSessions({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const { manager } = context

  const { cart } = data

  if (!cart.payment_sessions?.length) {
    return
  }

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.upsertPaymentSessions(cart)
}

upsertPaymentSessions.aliases = {
  cart: "cart",
}
