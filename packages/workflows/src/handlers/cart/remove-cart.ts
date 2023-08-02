import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function removeCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.delete(
    data[InputAlias.Cart].id
  )
}
