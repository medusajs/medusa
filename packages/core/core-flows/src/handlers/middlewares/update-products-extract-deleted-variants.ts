import { ProductTypes, ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { UpdateProductsPreparedData } from "../product"

export async function updateProductsExtractDeletedVariants({
  data,
  container,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData // products state before the update
  products: ProductTypes.ProductDTO[] // updated products
}>) {
  const deletedVariants: ProductVariantDTO[] = []

  data.products.forEach((product) => {
    const removedVariants: ProductVariantDTO[] = []

    const originalProduct = data.preparedData.originalProducts.find(
      (p) => p.id === product.id
    )!

    originalProduct.variants.forEach((variant) => {
      if (!product.variants.find((v) => v.id === variant.id)) {
        removedVariants.push(variant)
      }
    })

    deletedVariants.push(...removedVariants)
  })

  return {
    alias: updateProductsExtractDeletedVariants.aliases.output,
    value: {
      variants: deletedVariants,
    },
  }
}

updateProductsExtractDeletedVariants.aliases = {
  preparedData: "preparedData",
  products: "products",
  output: "updateProductsExtractDeletedVariantsOutput",
}
