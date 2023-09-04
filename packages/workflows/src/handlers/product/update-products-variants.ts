import { ProductVariantDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductId = string

export type UpdateProductsVariantsData = {
  productsVariantsToUpdate: Map<ProductId, ProductVariantDTO[]>
}

export async function updateProductsVariants({
  context: { manager },
  container,
  data,
}: WorkflowArguments<UpdateProductsVariantsData>): Promise<void> {
  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  for (const [productId, variants] of data.productsVariantsToUpdate.entries()) {
    if (!variants.length) {
      return
    }

    for (const variant of variants) {
      await productVariantServiceTx.update(variant.id, variant)
    }
  }
}

updateProductsVariants.aliases = {
  payload: "payload",
}
