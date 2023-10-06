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

  const cartService = container.resolve("cartService").withTransaction(manager)

  console.log(cart.shipping_methods)
  try {
    await cartService.upsertPaymentSessions(cart)
  } catch (e) {
    console.log(e)
  }
}

upsertPaymentSessions.aliases = {
  cart: "cart",
}
