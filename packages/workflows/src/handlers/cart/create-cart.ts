import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function createCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  const cart = await cartServiceTx.create(data[InputAlias.Cart])

  data[InputAlias.Cart].id = cart.id

  return data[InputAlias.Cart]
}
