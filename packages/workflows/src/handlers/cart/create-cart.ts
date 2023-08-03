import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)
console.log("data - ", data)
  return await cartServiceTx.create({
    ...data[CartInputAlias.Cart],
    ...data[CartInputAlias.CartAddresses],
    ...data[CartInputAlias.CartCustomer],
    ...data[CartInputAlias.CartRegion],
    ...data[CartInputAlias.CartContext],
  })
}
