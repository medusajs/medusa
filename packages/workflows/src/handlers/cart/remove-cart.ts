import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

export async function removeCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.delete(
    data[CartInputAlias.Cart].id
  )
}
