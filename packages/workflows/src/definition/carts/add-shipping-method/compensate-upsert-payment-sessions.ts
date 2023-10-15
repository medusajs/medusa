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

  const cartService = container.resolve("cartService").withTransaction(manager)

  const { cart: cartBefore } = data // initial cart data

  const cartAfter = await cartService.retrieve(cartBefore.id, {
    relations: ["payment_sessions"],
  })

  await cartService.restorePaymentSessions(
    cartBefore.payment_sessions,
    cartAfter.payment_sessions,
    cartBefore
  )
}

compensateUpsertPaymentSessions.aliases = {
  cart: "cart",
}
