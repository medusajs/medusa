import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type HandlerInput = {
  cart: CartDTO
}

export async function compensateUpsertPaymentSessions({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const { manager } = context

  const { cart } = data

  const cartService = container.resolve("cartService").withTransaction(manager)

  const { payment_sessions, payment_session } = await cartService.retrieve(
    cart.id,
    { relations: ["payment_sessions"] }
  )

  await cartService.upsertPaymentSessions({
    ...cart,
    payment_sessions,
    payment_session,
  })
}

compensateUpsertPaymentSessions.aliases = {
  cart: "cart",
}
