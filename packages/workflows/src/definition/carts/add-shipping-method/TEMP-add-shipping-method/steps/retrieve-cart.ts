import { CartDTO, FindConfig } from "@medusajs/types"
import { isString } from "@medusajs/utils"
import { Cart } from "../../../../../../../medusa/dist"
import { WorkflowArguments } from "../../../../../helper"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: string | CartDTO
  config: FindConfig<Cart>
}

async function invoke({
  container,
  context,
  data,
}: WorkflowArguments<InvokeInput>) {
  const { manager } = context

  const cartService = container.resolve("cartService")
  const cartServiceTx = cartService.withTransaction(manager)

  const cartId = isString(data.cart) ? data.cart : data.cart.id

  const retrieved = await cartServiceTx.retrieveWithTotals(cartId!, data.config)

  return { cart: retrieved }
}

export const retrieveCartStep = createStep("retrieveCartStep", invoke)
