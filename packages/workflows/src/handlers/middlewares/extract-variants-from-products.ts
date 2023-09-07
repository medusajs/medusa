import { ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

export async function extractVariantsFromProduct({
  data,
}: WorkflowArguments<{
  products: ProductTypes.ProductDTO[]
}>) {
  const variants = data.products.reduce(
    (
      acc: ProductTypes.ProductVariantDTO[],
      product: ProductTypes.ProductDTO
    ) => {
      if (product.variants?.length) {
        return acc.concat(product.variants)
      }
      return acc
    },
    []
  )

  return {
    alias: extractVariantsFromProduct.aliases.output,
    value: {
      variants,
    },
  }
}

extractVariantsFromProduct.aliases = {
  output: "createProductsPrepareCreatePricesCompensationOutput",
}
