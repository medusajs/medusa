import { InputAlias } from "../definitions"
import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../helper"

export async function createProducts<T = ProductTypes.ProductDTO[]>({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: { [InputAlias.Products]: ProductTypes.CreateProductDTO[] }
}): Promise<PipelineHandlerResult<T>> {
  const productModuleService = container.resolve("productModuleService")

  return await productModuleService.create(data[InputAlias.Products], context)
}
