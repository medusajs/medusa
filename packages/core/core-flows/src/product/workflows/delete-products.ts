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
import { deleteProductsStep } from "../steps/delete-products"
import { getProductsStep } from "../steps/get-products"
import { deleteInventoryItemWorkflow } from "../../inventory"

export type DeleteProductsWorkflowInput = { ids: string[] }

export const deleteProductsWorkflowId = "delete-products"
/**
 * This workflow deletes one or more products.
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
            if (inventoryItem.variants.every((v) => variantsMap.has(v.id))) {
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
