import { ProductTypes, ProductVariantDTO, WorkflowTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"
import { MedusaError } from "@medusajs/utils"

type ProductId = string

export type UpdateProductsVariantsPrepareData = {
  products: ProductTypes.UpdateProductDTO[]
  productVariantsToDelete: Map<ProductId, ProductVariantDTO[]> // TODO: change ProductVariantDTO
  productVariantsToCreate: Map<ProductId, ProductVariantDTO[]>
  productVariantsToUpdate: Map<ProductId, ProductVariantDTO[]>
}

export async function updateProductsVariantsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO>): Promise<UpdateProductsVariantsPrepareData> {
  const { manager } = context
  let products = data.products

  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const productVariantsToDelete: Map<ProductId, ProductVariantDTO[]> = new Map()
  const productVariantsToCreate: Map<ProductId, ProductVariantDTO[]> = new Map()
  const productVariantsToUpdate: Map<ProductId, ProductVariantDTO[]> = new Map()

  for (const product of products) {
    productVariantsToDelete[product.id] = []
    productVariantsToCreate[product.id] = []
    productVariantsToUpdate[product.id] = []

    const updateVariantsIds = new Set()
    const variantIdsNotBelongingToProduct: string[] = []

    const productVariants = await productVariantServiceTx.list({
      product_id: product.id,
    })

    product.variants?.forEach((variant, index) => {
      if (!variant.id) {
        Object.assign(variant, {
          variant_rank: index,
          options: variant.options || [],
          prices: variant.prices || [],
        })
        productVariantsToCreate[product.id].push(variant)
        return
      }

      updateVariantsIds.add(variant.id)

      if (!productVariants.find((v) => v.id === variant.id)) {
        variantIdsNotBelongingToProduct.push(variant.id)
        return
      }

      const productVariant = productVariants.find((v) => v.id === variant.id)!
      Object.assign(variant, {
        variant_rank: index,
        product_id: productVariant.product_id,
      })
      productVariantsToUpdate[product.id].push(variant)
    })

    if (variantIdsNotBelongingToProduct.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variants with id: ${variantIdsNotBelongingToProduct.join(
          ", "
        )} are not associated with the product: ${product.id}`
      )
    }

    if (product.variants) {
      productVariantsToDelete[product.id] = productVariants.filter(
        (v) => !updateVariantsIds.has(v.id)
      )
    }
  }

  return {
    products: products as ProductTypes.UpdateProductDTO[],
    productVariantsToUpdate: productVariantsToUpdate,
    productVariantsToCreate: productVariantsToCreate,
    productVariantsToDelete: productVariantsToDelete,
  }
}

updateProductsVariantsPrepareData.aliases = {
  payload: "payload",
}
