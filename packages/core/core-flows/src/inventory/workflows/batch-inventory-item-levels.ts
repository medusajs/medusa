import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  InventoryLevelDTO,
  InventoryTypes,
} from "@medusajs/framework/types"
import { InventoryLevelWorkflowEvents } from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"
import { createInventoryLevelsStep, updateInventoryLevelsStep } from "../steps"
import { deleteInventoryLevelsWorkflow } from "./delete-inventory-levels"

/**
 * The data to manage the inventory levels in bulk.
 *
 * @property create - The inventory levels to create.
 * @property update - The inventory levels to update.
 * @property delete - The IDs of inventory levels to delete.
 */
export interface BatchInventoryItemLevelsWorkflowInput
  extends BatchWorkflowInput<
    InventoryTypes.CreateInventoryLevelInput,
    InventoryTypes.UpdateInventoryLevelInput
  > {
  /**
   * If true, the workflow will force the deletion of the inventory levels, even
   * if they have a non-zero stocked quantity. If false, the workflow will
   * not delete the inventory levels if they have a non-zero stocked quantity.
   *
   * Inventory levels that have reserved or incoming items at the location
   * will not be deleted even if the force flag is set to true.
   *
   * @default false
   */
  force?: boolean
}

/**
 * The result of managing inventory levels in bulk.
 *
 * @property created - The inventory levels that were created.
 * @property updated - The inventory levels that were updated.
 * @property deleted - The IDs of the inventory levels that were deleted.
 */
export interface BatchInventoryItemLevelsWorkflowOutput
  extends BatchWorkflowOutput<InventoryLevelDTO> {}

export const batchInventoryItemLevelsWorkflowId =
  "batch-inventory-item-levels-workflow"

/**
 * This workflow creates, updates and deletes inventory levels in bulk.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to manage inventory levels in your custom flows.
 *
 * @example
 * const { result } = await batchInventoryItemLevelsWorkflow(container)
 * .run({
 *   input: {
 *     create: [
 *       {
 *         inventory_item_id: "iitem_123",
 *         location_id: "sloc_123"
 *       }
 *     ],
 *     update: [
 *       {
 *         id: "iilev_123",
 *         inventory_item_id: "iitem_123",
 *         location_id: "sloc_123",
 *         stocked_quantity: 10
 *       }
 *     ],
 *     delete: ["iilev_321"]
 *   }
 * })
 *
 * @summary
 *
 * Manage inventory levels in bulk.
 */
export const batchInventoryItemLevelsWorkflow = createWorkflow(
  batchInventoryItemLevelsWorkflowId,
  (input: WorkflowData<BatchInventoryItemLevelsWorkflowInput>) => {
    const { createInput, updateInput, deleteInput } = transform(
      input,
      (data) => {
        return {
          createInput: data.create || [],
          updateInput: data.update || [],
          deleteInput: {
            id: data.delete || [],
            force: data.force ?? false,
          },
        }
      }
    )

    const res = parallelize(
      createInventoryLevelsStep(createInput),
      updateInventoryLevelsStep(updateInput),
      deleteInventoryLevelsWorkflow.runAsStep({
        input: deleteInput,
      })
    )

    const { createdEvents, updatedEvents } = transform({ res }, ({ res }) => {
      return {
        createdEvents: (res[0] || []).map((level) => ({ id: level.id })),
        updatedEvents: (res[1] || []).map((level) => ({ id: level.id })),
      }
    })

    // Delete event is emitted by the deleteInventoryLevelsWorkflow, so we don't need to emit it here.
    parallelize(
      emitEventStep({
        eventName: InventoryLevelWorkflowEvents.CREATED,
        data: createdEvents,
      }).config({ name: "emit-inventory-level-created" }),
      emitEventStep({
        eventName: InventoryLevelWorkflowEvents.UPDATED,
        data: updatedEvents,
      }).config({ name: "emit-inventory-level-updated" })
    )

    return new WorkflowResponse(
      transform({ res, input }, (data) => {
        return {
          created: data.res[0],
          updated: data.res[1],
          deleted: data.input.delete,
        } as BatchInventoryItemLevelsWorkflowOutput
      })
    )
  }
)
