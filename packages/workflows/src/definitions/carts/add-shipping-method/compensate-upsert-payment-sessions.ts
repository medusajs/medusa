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

  const initialProviderIdsSet = new Set(
    cartBefore.payment_sessions.map((ps) => ps.provider_id)
  )

  const cartAfter = await cartService.retrieve(cartBefore.id, {
    relations: ["payment_sessions"],
  })

  await Promise.all(
    cartAfter.payment_sessions.map(async (session) => {
      if (!initialProviderIdsSet.has(session.provider_id)) {
        await cartService.deletePaymentSessionLocalAndRemote(session)
      }
    })
  )

  if (!cartBefore.payment_sessions?.length) {
    return
  }

  await cartService.upsertPaymentSessions(cartBefore)
}

compensateUpsertPaymentSessions.aliases = {
  cart: "cart",
}
