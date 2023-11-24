import { ProductTypes, ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { UpdateProductsPreparedData } from "../product"

export async function updateProductsExtractCreatedVariants({
  data,
}: WorkflowArguments<{
  preparedData: UpdateProductsPreparedData // products state before the update
  products: ProductTypes.ProductDTO[] // updated products
}>) {
  const createdVariants: ProductVariantDTO[] = []

  data.products.forEach((product) => {
    const addedVariants: ProductVariantDTO[] = []

    const originalProduct = data.preparedData.originalProducts.find(
      (p) => p.id === product.id
    )!

    product.variants.forEach((variant) => {
      if (!originalProduct.variants.find((v) => v.id === variant.id)) {
        addedVariants.push(variant)
      }
    })

    createdVariants.push(...addedVariants)
  })

  return {
    alias: updateProductsExtractCreatedVariants.aliases.output,
    value: [{ variants: createdVariants }],
  }
}

updateProductsExtractCreatedVariants.aliases = {
  preparedData: "preparedData",
  products: "products",
  output: "products",
}
