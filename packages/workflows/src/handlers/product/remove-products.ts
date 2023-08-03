import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export const RemoveProductsInputAlias = "removeProducts"

export async function removeProducts<T = void>({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [RemoveProductsInputAlias]: ProductTypes.ProductDTO[]
  }
}): Promise<PipelineHandlerResult<T>> {
  data = data[RemoveProductsInputAlias]

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  await productModuleService.softDelete(data.map((p) => p.id))
  return void 0 as unknown as PipelineHandlerResult<T>
}
