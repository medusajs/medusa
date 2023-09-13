import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  products: ProductTypes.UpdateProductDTO[]
  config: { listConfig: { relations?: string[]; select?: string[] } }
}

export async function updateProducts({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  if (!data.products.length) {
    return []
  }

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const products = await productModuleService.update(data.products)

  return await productModuleService.list(
    { id: products.map((p) => p.id) },
    { relations: data.config.listConfig?.relations }
  )
}

updateProducts.aliases = {
  products: "products",
}
