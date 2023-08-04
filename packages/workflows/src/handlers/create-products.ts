import { InputAlias } from "../definitions"
import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../helper"

export async function createProducts({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: { [InputAlias.Products]: ProductTypes.CreateProductDTO[] }
}): Promise<ProductTypes.ProductDTO[]> {
  const productModuleService = container.resolve("productModuleService")

  return await productModuleService.create(data[InputAlias.Products], context)
}
