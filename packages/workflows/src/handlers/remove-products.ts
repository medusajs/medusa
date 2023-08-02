import { InputAlias } from "../definitions"
import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../helper"

export async function removeProducts<T = any>({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.Products]: ProductTypes.ProductDTO[]
  }
}): Promise<PipelineHandlerResult<T>> {
  const productModuleService = container.resolve("productModuleService")
  return await productModuleService.softDelete(
    data[InputAlias.Products].map((p) => p.id)
  )
}
