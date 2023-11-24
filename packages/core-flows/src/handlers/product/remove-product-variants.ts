import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type HandlerInput = { productVariants: { id: string }[] }

export async function removeProductVariants({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  if (!data.productVariants.length) {
    return
  }

  const productModuleService: IProductModuleService = container.resolve(
    ModulesDefinition[Modules.PRODUCT].registrationName
  )

  await productModuleService.deleteVariants(
    data.productVariants.map((p) => p.id)
  )
}

removeProductVariants.aliases = {
  productVariants: "productVariants",
}
