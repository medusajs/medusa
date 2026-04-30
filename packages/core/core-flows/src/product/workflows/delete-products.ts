import { Modules, ProductWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  emitEventStep,
  removeRemoteLinkStep,
  useQueryGraphStep,
} from "../../common"
import { deleteInventoryItemWorkflow } from "../../inventory"
import { deleteProductsStep } from "../steps/delete-products"
import { deleteProductOptionsWorkflow } from "./delete-product-options"

/**
 * The data to delete one or more products.
 */
export type DeleteProductsWorkflowInput = {
  /**
   * The IDs of the products to delete.
   */
  ids: string[]
}

export const deleteProductsWorkflowId = "delete-products"
/**
 * This workflow deletes one or more products. It's used by the
 * [Delete Products Admin API Route](https://docs.medusajs.com/api/admin#products_deleteproductsid).
 *
 * This workflow has a hook that allows you to perform custom actions after the products are deleted. For example,
 * you can delete custom records linked to the products.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product deletion.
 *
 * @example
 * const { result } = await deleteProductsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["product_123"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more products.
 *
 * @property hooks.productsDeleted - This hook is executed after the products are deleted. You can consume this hook to perform custom actions on the deleted products.
 */
export const deleteProductsWorkflow = createWorkflow(
  deleteProductsWorkflowId,
  (input: WorkflowData<DeleteProductsWorkflowInput>) => {
    const productsToDeleteResponse = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "variants.id",
        "variants.manage_inventory",
        "variants.inventory.id",
        "variants.inventory.variants.id",
        "options.id",
        "options.is_exclusive",
      ],
      filters: {
        id: input.ids,
      },
    }).config({ name: "query-products-with-options-step" })

    const productsToDelete = transform({ productsToDeleteResponse }, (data) => {
      return data.productsToDeleteResponse.data
    })

    const exclusiveOptionsToDelete = transform(
      { products: productsToDelete },
      (data) => {
        const products = data.products || []
        const exclusiveOptionIds = new Set<string>()

        products.forEach((product) => {
          const productOptions = product.options || []
          productOptions.forEach((option) => {
            if (option.is_exclusive) {
              exclusiveOptionIds.add(option.id)
            }
          })
        })

        return Array.from(exclusiveOptionIds)
      }
    )

    const { variantsToBeDeleted, allVariantsIds } = transform(
      { productsToDelete },
      (data) => {
        const allVariants = data.productsToDelete.flatMap(
          (product) => product.variants || []
        )

        const allVariantsIds = allVariants.map((variant) => variant.id)

        return { variantsToBeDeleted: allVariants, allVariantsIds }
      }
    )

    const toDeleteInventoryItemIds = transform(
      { variants: variantsToBeDeleted },
      (data) => {
        const variantsMap = new Map(
          data.variants.map((variant) => [variant.id, variant])
        )

        const toDeleteIds: Set<string> = new Set()

        data.variants.forEach((variant) => {
          if (variant.manage_inventory) {
            variant.inventory.forEach((inventoryItem) => {
              // only if every variant that is linked to the inventory item is being deleted, we can remove the item
              if (!!inventoryItem && inventoryItem.variants.every((v) => variantsMap.has(v.id))) {
                toDeleteIds.add(inventoryItem.id)
              }
            })
          }
        })

        return Array.from(toDeleteIds)
      }
    )

    deleteInventoryItemWorkflow.runAsStep({
      input: toDeleteInventoryItemIds,
    })

    const [, deletedProduct] = parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: {
          variant_id: allVariantsIds,
          product_id: input.ids,
        },
      }).config({ name: "remove-product-variant-link-step" }),
      deleteProductsStep(input.ids)
    )

    deleteProductOptionsWorkflow.runAsStep({
      input: {
        ids: exclusiveOptionsToDelete,
      },
    })

    const productIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductWorkflowEvents.DELETED,
      data: productIdEvents,
    })

    const productsDeleted = createHook("productsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProduct, {
      hooks: [productsDeleted],
    })
  }
)
