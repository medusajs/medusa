import { ProductTypes, ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"
import { UpdateProductsPreparedData } from "../product"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

export async function updateProductsPrepareInventoryUpdate({
  data,
  container,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData // products state before the update
  products: ProductTypes.ProductDTO[] // updated products
}>) {
  const createdVariantsMap = new Map()
  const deletedVariantsMap = new Map()

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  console.log("Prep inventory", data)

  data.products.forEach((product) => {
    const addedVariants: ProductVariantDTO[] = []
    const removedVariants: ProductVariantDTO[] = []

    const originalProduct = data.preparedData.originalProducts.find(
      (p) => p.id === product.id
    )!

    product.variants.forEach((variant) => {
      if (!originalProduct.variants.find((v) => v.id === variant.id)) {
        addedVariants.push(variant)
      }
    })

    originalProduct.variants.forEach((variant) => {
      if (!product.variants.find((v) => v.id === variant.id)) {
        removedVariants.push(variant)
      }
    })

    createdVariantsMap.set(product.id, addedVariants)
    deletedVariantsMap.set(product.id, removedVariants)
  })

  return {
    alias: updateProductsPrepareInventoryUpdate.aliases.output,
    value: {
      createdVariantsMap,
      deletedVariantsMap,
    },
  }
}

updateProductsPrepareInventoryUpdate.aliases = {
  preparedData: "preparedData",
  products: "products",
  output: "updateProductsPrepareInventoryUpdateOutput",
}
