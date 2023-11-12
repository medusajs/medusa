import { CartDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: CartDTO
  originalCart: CartDTO // used for compensation
}

type InvokeOutput = {
  compensationData: { cart: CartDTO }
}

type CompensateInput = {
  compensationData: { cart: CartDTO }
}

type CompensateOutput = void

async function adjustFreeShipping_({ context, cart, container }) {
  const { manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)

  await cartService.adjustFreeShipping(cart, true)
}

async function invoke(input, data): Promise<InvokeOutput> {
  await adjustFreeShipping_({
    context: input.context,
    cart: data.cart,
    container: input.container,
  })

  // return original cart for compensation
  return { compensationData: { cart: data.originalCart } }
}

async function compensate(
  input,
  data // compensationData
): Promise<CompensateOutput> {
  console.log(">>>> seems to be undefined", data)
  // await adjustFreeShipping_({
  //   context,
  //   cart: data.compensationData.cart,
  //   container,
  // })
}

export const adjustFreeShippingStep = createStep(
  "adjustFreeShippingStep",
  invoke,
  compensate
)
