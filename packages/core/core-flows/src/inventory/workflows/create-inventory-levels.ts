import type {
  InventoryLevelDTO,
  InventoryTypes,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import {
  createInventoryLevelsStep,
  validateInventoryLocationsStep,
} from "../steps"

/**
 * The data to create the inventory levels.
 */
export interface CreateInventoryLevelsWorkflowInput {
  /**
   * The inventory levels to create.
   */
  inventory_levels: InventoryTypes.CreateInventoryLevelInput[]
}
export const createInventoryLevelsWorkflowId =
  "create-inventory-levels-workflow"
/**
 * This workflow creates one or more inventory levels. It's used by the
 * [Create Inventory Level API Route](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevels).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create inventory levels in your custom flows.
 *
 * @example
 * const { result } = await createInventoryLevelsWorkflow(container)
 * .run({
 *   input: {
 *     inventory_levels: [
 *       {
 *         inventory_item_id: "iitem_123",
 *         location_id: "sloc_123",
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more inventory levels.
 */
export const createInventoryLevelsWorkflow = createWorkflow(
  createInventoryLevelsWorkflowId,
  (
    input: WorkflowData<CreateInventoryLevelsWorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    validateInventoryLocationsStep(input.inventory_levels)

    return new WorkflowResponse(
      createInventoryLevelsStep(input.inventory_levels)
    )
  }
)
