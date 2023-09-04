import { ProductVariantDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type ProductId = string

type HandlerInput = {
  productsVariantsToRemove: Map<ProductId, ProductVariantDTO[]>
}

export async function removeProductsVariants({
  context: { manager },
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  for (const [productId, variants] of data.productsVariantsToRemove.entries()) {
    if (!variants.length) {
      return
    }

    await productVariantServiceTx.delete(variants.map((v) => v.id))
  }
}

// TODO: remove
removeProductsVariants.aliases = {
  products: "products",
}
