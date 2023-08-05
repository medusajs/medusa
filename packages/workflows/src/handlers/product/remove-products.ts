import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

export async function removeProducts({
  container,
  data,
}: WorkflowArguments<{ products: ProductTypes.ProductDTO[] }>): Promise<void> {
  if (!data.products.length) {
    return
  }

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  await productModuleService.softDelete(data.products.map((p) => p.id))
}

removeProducts.aliases = {
  products: "products",
}
