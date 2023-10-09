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

  await cartService.upsertPaymentSessions(
    // TODO: condition for testing, remove before merge after pipe is fixed
    // @ts-ignore
    data.retrieveConfig?.relations[0] === "payment_sessions" ? cart.id : cart
  )
}

upsertPaymentSessions.aliases = {
  cart: "cart",
}
