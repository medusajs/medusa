import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function createCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.create(data[CartInputAlias.Cart])
}
