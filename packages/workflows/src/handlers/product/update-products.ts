import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { products: ProductTypes.UpdateProductDTO[] }

export async function updateProducts({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  if (!data.products.length) {
    return []
  }

  console.log("Update called", data)

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const products = await productModuleService.update(data.products, context)

  return await productModuleService.list(
    { id: products.map((p) => p.id) },
    { relations: ["variants"] } // TODO: pass relations
    // context
  )
}

updateProducts.aliases = {
  products: "products",
}
