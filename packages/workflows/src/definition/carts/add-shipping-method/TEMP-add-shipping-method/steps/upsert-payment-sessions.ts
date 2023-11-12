import { CartDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: CartDTO
  originalCart: CartDTO
}

type InvokeOutput = {
  compensationData: { cart: CartDTO }
} | void

type CompensateInput = {
  cart: CartDTO
}

type CompensateOutput = void

async function invoke(input, data): Promise<InvokeOutput> {
  const { manager, container } = input

  const { cart, originalCart } = data

  if (!cart.payment_sessions?.length) {
    return
  }

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.upsertPaymentSessions(cart)

  return { compensationData: { cart: originalCart } }
}

async function compensate(
  input,
  data // compensationData
): Promise<CompensateOutput> {
  const { context, container } = input

  const cartService = container
    .resolve("cartService")
    .withTransaction(context.manager)

  const { cart } = data // original cart data

  const cartAfter = await cartService.retrieve(cart.id, {
    relations: ["payment_sessions"],
  })

  await cartService.restorePaymentSessions(
    cart.payment_sessions,
    cartAfter.payment_sessions,
    cart
  )
}

export const upsertPaymentSessionsStep = createStep(
  "upsertPaymentSessionsStep",
  invoke,
  compensate
)
