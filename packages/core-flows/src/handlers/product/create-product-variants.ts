import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { BigNumberInput, ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type VariantPrice = {
  region_id?: string
  currency_code?: string
  amount: BigNumberInput
  min_quantity?: BigNumberInput
  max_quantity?: BigNumberInput
}

type HandlerInput = {
  productVariantsMap: Map<string, ProductTypes.CreateProductVariantDTO[]>
  variantIndexPricesMap: Map<number, VariantPrice[]>
}

export async function createProductVariants({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<{
  productVariants: ProductTypes.ProductVariantDTO[]
  variantPricesMap: Map<string, VariantPrice[]>
}> {
  const { productVariantsMap, variantIndexPricesMap } = data
  const variantPricesMap = new Map<string, VariantPrice[]>()
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const productVariants = await productModuleService.createVariants(
    [...productVariantsMap.values()].flat()
  )

  productVariants.forEach((variant, index) => {
    variantPricesMap.set(variant.id, variantIndexPricesMap.get(index) || [])
  })

  return {
    productVariants,
    variantPricesMap,
  }
}

createProductVariants.aliases = {
  payload: "payload",
}
