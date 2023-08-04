import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

export async function createProducts({
  container,
  data,
}: WorkflowArguments<{
  products: ProductTypes.CreateProductDTO[]
}>): Promise<ProductTypes.ProductDTO[]> {
  const data_ = data.products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.create(data_)
}

createProducts.aliases = {
  payload: "payload",
}
