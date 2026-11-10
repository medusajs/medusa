import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  isObject,
  isPresent,
  MedusaError,
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the products update.
 */
export type UpdateProductsStepInput =
  | {
      /**
       * The filters to select the products to update.
       */
      selector: ProductTypes.FilterableProductProps
      /**
       * The data to update the products with.
       */
      update: ProductTypes.UpdateProductDTO
    }
  | {
      /**
       * The data to create or update products.
       */
      products: ProductTypes.UpsertProductDTO[]
    }

// Keep only the fields the update sets, so unrelated references loaded with
// the product (e.g. `type` next to `type_id`) don't override the restored values.
// Metadata is merged on update, so keys the update added are cleared with "".
function buildRestoreData(
  product: ProductTypes.ProductDTO,
  update: ProductTypes.UpdateProductDTO
) {
  const restoreData: Record<string, any> = {
    id: product.id,
    options: product.options,
  }

  for (const key of Object.keys(update)) {
    if (key !== "options" && key in product) {
      restoreData[key] = product[key]
    }
  }

  if (isPresent(restoreData.metadata) && isObject(update.metadata)) {
    const metadata = { ...restoreData.metadata }
    for (const key of Object.keys(update.metadata)) {
      if (!(key in metadata)) {
        metadata[key] = ""
      }
    }
    restoreData.metadata = metadata
  }

  return restoreData as ProductTypes.ProductDTO
}

export const updateProductsStepId = "update-products"
/**
 * This step updates one or more products.
 *
 * @example
 * To update products by their ID:
 *
 * ```ts
 * const data = updateProductsStep({
 *   products: [
 *     {
 *       id: "prod_123",
 *       title: "Shirt"
 *     }
 *   ]
 * })
 * ```
 *
 * To update products matching a filter:
 *
 * ```ts
 * const data = updateProductsStep({
 *   selector: {
 *     collection_id: "collection_123",
 *   },
 *   update: {
 *     material: "cotton",
 *   }
 * })
 * ```
 */
export const updateProductsStep = createStep(
  updateProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if ("products" in data) {
      if (data.products.some((p) => !p.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product ID is required when doing a batch update of products"
        )
      }

      if (!data.products.length) {
        return new StepResponse([], {
          prevProducts: [],
          targetOptionIdsByProductId: {},
        })
      }

      // Capture the prior option associations (with their value subsets) and
      // the option_ids the update targets for compensation
      const prevProducts = await service.listProducts(
        {
          id: data.products.map((p) => p.id) as string[],
        },
        { relations: ["options.values"] }
      )

      const targetOptionIdsByProductId: Record<string, string[]> = {}
      for (const product of data.products) {
        if (product.option_ids !== undefined) {
          targetOptionIdsByProductId[product.id as string] = product.option_ids
        }
      }

      const updateById = new Map(
        data.products.map((product) => [product.id, product])
      )

      const products = await service.upsertProducts(data.products)
      return new StepResponse(products, {
        prevProducts: prevProducts.map((product) =>
          buildRestoreData(product, updateById.get(product.id) ?? {})
        ),
        targetOptionIdsByProductId,
      })
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data.update],
      { objectFields: ["metadata"] }
    )

    const prevProducts = await service.listProducts(data.selector, {
      select: selects,
      relations: [...new Set([...relations, "options.values"])],
    })

    const targetOptionIdsByProductId: Record<string, string[]> = {}
    if (data.update.option_ids !== undefined) {
      for (const product of prevProducts) {
        targetOptionIdsByProductId[product.id] = data.update.option_ids
      }
    }

    const products = await service.updateProducts(data.selector, data.update)
    return new StepResponse(products, {
      prevProducts: prevProducts.map((product) =>
        buildRestoreData(product, data.update)
      ),
      targetOptionIdsByProductId,
    })
  },
  async (compensationData, { container }) => {
    const prevProducts = compensationData?.prevProducts ?? []
    const targetOptionIdsByProductId =
      compensationData?.targetOptionIdsByProductId ?? {}

    if (!prevProducts.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    // Revert the products' scalar fields. We omit option links here and
    // reconcile them explicitly below so we can restore the exact value subsets
    await service.upsertProducts(
      prevProducts.map((product) => {
        const { options: _options, ...rest } = product
        return rest
      })
    )

    // Reconcile option links by diffing the prior associations against the
    // option_ids the update targeted (captured at invoke).
    const unlinkPairs: { product_id: string; product_option_id: string }[] = []
    const relinkLinks: {
      product_id: string
      product_option_id: string
      product_option_value_ids: string[]
    }[] = []

    for (const product of prevProducts) {
      const targetOptionIds = targetOptionIdsByProductId[product.id]
      if (!targetOptionIds) {
        continue
      }

      const priorOptions = product.options ?? []
      const priorOptionIds = priorOptions.map((option) => option.id)

      // Options the update added (in target, not before) → unlink.
      for (const optionId of arrayDifference(targetOptionIds, priorOptionIds)) {
        unlinkPairs.push({
          product_id: product.id,
          product_option_id: optionId,
        })
      }

      // Options the update dropped (before, not in target) → restore + re-link
      // with the exact values the product had.
      const droppedOptionIds = new Set(
        arrayDifference(priorOptionIds, targetOptionIds)
      )
      for (const option of priorOptions) {
        if (droppedOptionIds.has(option.id)) {
          relinkLinks.push({
            product_id: product.id,
            product_option_id: option.id,
            product_option_value_ids: (option.values ?? []).map(
              (value) => value.id
            ),
          })
        }
      }
    }

    if (unlinkPairs.length) {
      await service.removeProductOptionFromProduct(unlinkPairs)
    }

    if (relinkLinks.length) {
      const optionIds = [
        ...new Set(relinkLinks.map((link) => link.product_option_id)),
      ]
      // Restoring un-soft-deletes orphaned exclusive options; no-op otherwise.
      await service.restoreProductOptions(optionIds)
      await service.addProductOptionToProduct(relinkLinks)
    }
  }
)
