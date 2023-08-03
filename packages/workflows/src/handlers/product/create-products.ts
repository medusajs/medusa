import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

export async function createProducts({
  container,
  data,
}: WorkflowArguments<{
  input: { products: ProductTypes.CreateProductDTO[] }
}>): Promise<ProductTypes.ProductDTO[]> {
  const data_ = data.input.products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.create(data_)
}

createProducts.aliases = {
  input: "input",
}
