import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import {
  ProductDTO,
  ProductTypes,
  ProductVariantDTO,
  UpdateProductDTO,
} from "@medusajs/types"

import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { UpdateProductsPreparedData } from "./update-products-prepare-data"

type HandlerInput = UpdateProductsPreparedData & {
  variants: ProductVariantDTO[]
}

export async function revertUpdateProducts({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  // restore variants that have been soft deleted during update products step
  await productModuleService.restoreVariants(data.variants.map((v) => v.id))
  data.originalProducts.forEach((product) => {
    // @ts-ignore
    product.variants = product.variants.map((v) => ({ id: v.id }))
  })

  return await productModuleService.upsert(
    data.originalProducts as unknown as UpdateProductDTO[]
  )
}

revertUpdateProducts.aliases = {
  preparedData: "preparedData",
  variants: "variants",
}
