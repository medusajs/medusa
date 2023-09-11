import { ProductTypes, ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"
import { UpdateProductsPreparedData } from "../product"

export async function updateProductsPrepareInventoryUpdate({
  data,
  container,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData // products state before the update
  products: ProductTypes.ProductDTO[] // updated products
}>) {
  const createdVariants: ProductVariantDTO[] = []
  const deletedVariants: ProductVariantDTO[] = []

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

    createdVariants.push(...addedVariants)
    deletedVariants.push(...removedVariants)
  })

  return {
    alias: updateProductsPrepareInventoryUpdate.aliases.output,
    value: {
      createdVariants,
      deletedVariants,
    },
  }
}

updateProductsPrepareInventoryUpdate.aliases = {
  preparedData: "preparedData",
  products: "products",
  output: "updateProductsPrepareInventoryUpdateOutput",
}
