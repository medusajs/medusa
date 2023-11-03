import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  productVariantsMap: Map<string, ProductTypes.UpdateProductVariantDTO[]>
}

export async function updateProductVariants({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<
  ProductTypes.UpdateProductVariantDTO[]
> {
  const { productVariantsMap } = data
  const productsVariants: ProductTypes.UpdateProductVariantDTO[] = []
  const updateProductsData: ProductTypes.UpdateProductDTO[] = []
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  for (const [productId, variantsData = []] of productVariantsMap) {
    updateProductsData.push({
      id: productId,
      variants: variantsData,
    })

    productsVariants.push(...variantsData)
  }

  if (updateProductsData.length) {
    await productModuleService.update(updateProductsData)
  }

  return productsVariants
}

updateProductVariants.aliases = {
  payload: "payload",
}
