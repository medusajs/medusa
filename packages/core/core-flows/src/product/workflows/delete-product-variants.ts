import {
  Modules,
  ProductVariantWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  emitEventStep,
  removeRemoteLinkStep,
  useQueryGraphStep,
} from "../../common"
import { deleteProductVariantsStep } from "../steps"
import { deleteInventoryItemWorkflow } from "../../inventory"

export type DeleteProductVariantsWorkflowInput = { ids: string[] }

export const deleteProductVariantsWorkflowId = "delete-product-variants"
/**
 * This workflow deletes one or more product variants.
 */
export const deleteProductVariantsWorkflow = createWorkflow(
  deleteProductVariantsWorkflowId,
  (input: WorkflowData<DeleteProductVariantsWorkflowInput>) => {
    removeRemoteLinkStep({
      [Modules.PRODUCT]: { variant_id: input.ids },
    }).config({ name: "remove-variant-link-step" })

    const variantsWithInventoryStepResponse = useQueryGraphStep({
      entity: "variants",
      fields: [
        "id",
        "manage_inventory",
        "inventory.id",
        "inventory.variants.id",
      ],
      filters: {
        id: input.ids,
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

    const deletedProductVariants = deleteProductVariantsStep(input.ids)

    const variantIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductVariantWorkflowEvents.DELETED,
      data: variantIdEvents,
    })

    const productVariantsDeleted = createHook("productVariantsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductVariants, {
      hooks: [productVariantsDeleted],
    })
  }
)
