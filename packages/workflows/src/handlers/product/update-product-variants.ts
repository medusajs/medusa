import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  productVariants: ProductTypes.UpdateProductVariantDTO[]
  productVariantsMap: Map<string, ProductTypes.UpdateProductVariantDTO[]>
}

export async function updateProductVariants({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<
  ProductTypes.UpdateProductVariantDTO[]
> {
  const productsVariants: ProductTypes.UpdateProductVariantDTO[] = []
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const { productVariantsMap } = data

  for (const [productId, variantsData = []] of productVariantsMap) {
    await productModuleService.update([
      {
        id: productId,
        variants: variantsData,
      },
    ])

    productsVariants.push(...variantsData)
  }

  return productsVariants
}

updateProductVariants.aliases = {
  payload: "payload",
}
