import { CartDTO } from "@medusajs/types"
import { StepExecutionContext, createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: CartDTO
  originalCart: CartDTO // used for compensation
}

type InvokeOutput = {
  compensateInput: { cart: CartDTO }
}

async function adjustFreeShipping_({ context, cart, container }) {
  const { manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.adjustFreeShipping(cart, true)
}

export const adjustFreeShippingStep = createStep(
  "adjustFreeShippingStep",
  async function (
    input: InvokeInput,
    executionContext: StepExecutionContext
  ): Promise<InvokeOutput> {
    const container = executionContext.container

    await adjustFreeShipping_({
      context: executionContext.context,
      cart: input.cart,
      container: container,
    })

    return { compensateInput: { cart: input.originalCart } }
  },
  async function (input, executionContext): Promise<void> {
    const container = executionContext.container
    await adjustFreeShipping_({
      context: executionContext.context,
      cart: input.cart,
      container,
    })
  }
)
