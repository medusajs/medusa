import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { FilterableInventoryLevelProps } from "@medusajs/framework/types"
import { deduplicate, MedusaError, Modules } from "@medusajs/framework/utils"
import { useRemoteQueryStep } from "../../common"
import { deleteEntitiesStep } from "../../common/steps/delete-entities"

/**
 * This step validates that inventory levels are deletable.
 */
export const validateInventoryLevelsDelete = createStep(
  "validate-inventory-levels-delete",
  async function ({ inventoryLevels }: { inventoryLevels: any[] }) {
    const undeleteableItems = inventoryLevels.filter(
      (i) => i.reserved_quantity > 0 || i.stocked_quantity > 0
    )

    if (undeleteableItems.length) {
      const stockLocationIds = deduplicate(
        undeleteableItems.map((item) => item.location_id)
      )

      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot remove Inventory Levels for ${stockLocationIds} because there are stocked or reserved items at the locations`
      )
    }
  }
)

export const deleteInventoryLevelsWorkflowId =
  "delete-inventory-levels-workflow"
/**
 * This workflow deletes one or more inventory levels.
 */
export const deleteInventoryLevelsWorkflow = createWorkflow(
  deleteInventoryLevelsWorkflowId,
  (input: WorkflowData<FilterableInventoryLevelProps>) => {
    const inventoryLevels = useRemoteQueryStep({
      entry_point: "inventory_levels",
      fields: ["id", "stocked_quantity", "reserved_quantity", "location_id"],
      variables: {
        filters: input,
      },
    })

    validateInventoryLevelsDelete({ inventoryLevels })

    const idsToDelete = transform({ inventoryLevels }, ({ inventoryLevels }) =>
      inventoryLevels.map((il) => il.id)
    )

    deleteEntitiesStep({
      moduleRegistrationName: Modules.INVENTORY,
      invokeMethod: "softDeleteInventoryLevels",
      compensateMethod: "restoreInventoryLevels",
      data: idsToDelete,
    })

    return new WorkflowResponse(void 0)
  }
)
