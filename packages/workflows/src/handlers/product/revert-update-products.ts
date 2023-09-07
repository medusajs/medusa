import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes, UpdateProductDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { originalProducts: UpdateProductDTO[] }

export async function revertUpdateProducts({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.update(data.originalProducts)
}

revertUpdateProducts.aliases = {
  originalProducts: "products",
}
