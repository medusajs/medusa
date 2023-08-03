import { PipelineHandlerResult, WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

enum Aliases {
  Cart = "cart"
}

export async function removeCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.delete(
    data[Aliases.Cart].id
  )
}

removeCart.aliases = Aliases
