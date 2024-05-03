import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

type HandlerInput = { products: { id: string }[] }

export async function removeProducts({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
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
