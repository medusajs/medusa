import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function createProducts({
  container,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    input: { products: ProductTypes.CreateProductDTO[] }
  }
}): Promise<ProductTypes.ProductDTO[]> {
  const data_ = data.input.products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  return await productModuleService.create(data_)
}

createProducts.aliases = {
  input: "input",
}
