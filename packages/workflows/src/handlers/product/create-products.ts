import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

type HandlerInput = {
  products: ProductTypes.CreateProductDTO[]
}

export async function createProducts({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductTypes.ProductDTO[]> {
  const data_ = data.products

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.create(data_, context)
}

createProducts.aliases = {
  payload: "payload",
}
