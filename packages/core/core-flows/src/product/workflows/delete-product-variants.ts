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
  useRemoteQueryStep,
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

    const variantsWithInventory = useRemoteQueryStep({
      entry_point: "variants",
      fields: [
        "id",
        "inventory.id",
        "manage_inventory",
        "inventory.variants.id",
      ],
      variables: {
        id: input.ids,
      },
      list: true,
    })

    const toDeleteInventoryItemIds = transform(
      { variants: variantsWithInventory },
      (data) => {
        const variantsMap = new Map(data.variants.map((v) => v.id))
        const toDeleteIds: Set<string> = new Set()

        data.variants.forEach((variant) => {
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
