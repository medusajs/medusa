import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export const CreateProductsInputAlias = "createProducts"

export async function createProducts<T = ProductTypes.ProductDTO[]>({
  container,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    [CreateProductsInputAlias]: { products: ProductTypes.CreateProductDTO[] }
  }
}): Promise<PipelineHandlerResult<T>> {
  const data_ = data[CreateProductsInputAlias].products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  return (await productModuleService.create(
    data_
  )) as unknown as PipelineHandlerResult<T>
}

createProducts.aliases = {
  CreateProductsInputAlias,
}
