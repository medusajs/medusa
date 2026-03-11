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
import { getProductsStep } from "../steps/get-products"

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
    const productsToDelete = getProductsStep({ ids: input.ids })
    const variantsToBeDeleted = transform({ productsToDelete }, (data) => {
      return data.productsToDelete
        .flatMap((product) => product.variants)
        .map((variant) => variant.id)
    })

    const variantsWithInventoryStepResponse = useQueryGraphStep({
      entity: "variants",
      fields: [
        "id",
        "manage_inventory",
        "inventory.id",
        "inventory.variants.id",
      ],
      filters: {
        id: variantsToBeDeleted,
      },
    })

    const toDeleteInventoryItemIds = transform(
      { variants: variantsWithInventoryStepResponse.data },
      (data) => {
        const variants = data.variants || []

        const variantsMap = new Map(variants.map((v) => [v.id, true]))
        const toDeleteIds: Set<string> = new Set()

        variants.forEach((variant) => {
          if (!variant.manage_inventory) {
            return
          }

          for (const inventoryItem of variant.inventory) {
            if (
              !!inventoryItem &&
              inventoryItem.variants.every((v) => variantsMap.has(v.id))
            ) {
              toDeleteIds.add(inventoryItem.id)
            }
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
          variant_id: variantsToBeDeleted,
          product_id: input.ids,
        },
      }).config({ name: "remove-product-variant-link-step" }),
      deleteProductsStep(input.ids)
    )

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
