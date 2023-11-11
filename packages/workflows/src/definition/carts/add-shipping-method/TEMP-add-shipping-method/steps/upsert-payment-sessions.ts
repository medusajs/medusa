import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../../../helper"
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

async function invoke({
  container,
  context,
  data,
}: WorkflowArguments<InvokeInput>): Promise<InvokeOutput> {
  const { manager } = context

  const { cart, originalCart } = data

  if (!cart.payment_sessions?.length) {
    return
  }

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.upsertPaymentSessions(cart)

  return { compensationData: { cart: originalCart } }
}

async function compensate({
  container,
  context,
  data, // compensationData
}: WorkflowArguments<CompensateInput>): Promise<CompensateOutput> {
  const { manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)

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
  "deleteShippingMethodsStep",
  invoke,
  compensate
)
