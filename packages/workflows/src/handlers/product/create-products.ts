import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function createProducts({
  container,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    createProductsInput: { products: ProductTypes.CreateProductDTO[] }
  }
}): Promise<ProductTypes.ProductDTO[]> {
  const data_ = data.createProductsInput.products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  return await productModuleService.create(data_)
}

createProducts.aliases = {
  createProductsInput: "createProductsInput",
}
