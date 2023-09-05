import { ProductVariantDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductId = string

export type CreateProductsVariantsData = {
  productsVariantsToCreate: Map<ProductId, ProductVariantDTO[]>
}

export async function createProductsVariants({
  context: { manager },
  container,
  data,
}: WorkflowArguments<CreateProductsVariantsData>): Promise<
  { variants: ProductVariantDTO }[]
> {
  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const ret: ProductVariantDTO[] = []

  for (const [productId, variants] of data.productsVariantsToCreate.entries()) {
    if (!variants.length) {
      return []
    }

    const createdVariants = await productVariantServiceTx.create(
      productId,
      variants
    )
    ret.push(createdVariants)
  }

  return ret.map((r) => ({
    variants: r,
  }))
}

createProductsVariants.aliases = {
  payload: "payload",
}
