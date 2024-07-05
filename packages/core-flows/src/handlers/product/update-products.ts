import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "@medusajs/workflows-sdk"

type HandlerInput = {
  products: ProductTypes.UpdateProductDTO[]
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

  const products = await productModuleService.upsert(data.products)

  return await productModuleService.list(
    { id: products.map((p) => p.id) },
    {
      relations: [
        "variants",
        "variants.options",
        "images",
        "options",
        "tags",
        // "type",
        "collection",
        // "profiles",
        // "sales_channels",
      ],
      take: null,
    }
  )
}

updateProducts.aliases = {
  products: "products",
}
