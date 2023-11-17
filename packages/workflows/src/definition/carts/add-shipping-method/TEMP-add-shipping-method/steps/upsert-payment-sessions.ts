import { CartDTO } from "@medusajs/types"
import { StepExecutionContext, createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: CartDTO
  originalCart: CartDTO
}

type InvokeOutput = {
  compensateInput: { cart: CartDTO }
}

export const upsertPaymentSessionsStep = createStep(
  "upsertPaymentSessionsStep",
  async function (
    input: InvokeInput,
    executionContext: StepExecutionContext
  ): Promise<InvokeOutput> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const { cart, originalCart } = input

    if (!cart.payment_sessions?.length) {
      return { compensateInput: { cart: originalCart } }
    }

    const cartService = container
      .resolve("cartService")
      .withTransaction(manager)

    await cartService.upsertPaymentSessions(cart)

    return { compensateInput: { cart: originalCart } }
  },
  async function (input, executionContext): Promise<void> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const cartService = container
      .resolve("cartService")
      .withTransaction(manager)

    // forcing the type as we know that the input is not void
    const { cart } = input

    if (!cart.payment_sessions?.length) {
      return
    }

    const cartAfter = await cartService.retrieve(cart.id, {
      relations: ["payment_sessions"],
    })

    await cartService.restorePaymentSessions(
      cart.payment_sessions,
      cartAfter.payment_sessions,
      cart
    )
  }
)
