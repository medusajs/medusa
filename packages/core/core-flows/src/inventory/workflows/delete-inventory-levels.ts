import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import {
  FilterableInventoryLevelProps,
  InventoryLevelDTO,
} from "@medusajs/framework/types"
import {
  deduplicate,
  InventoryLevelWorkflowEvents,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { deleteEntitiesStep } from "../../common/steps/delete-entities"

/**
 * The data to validate the deletion of inventory levels.
 */
export type ValidateInventoryLevelsDeleteStepInput = {
  /**
   * The inventory levels to validate.
   */
  inventoryLevels: InventoryLevelDTO[]
  /**
   * If true, the inventory levels will be deleted even if they have stocked items.
   */
  force?: boolean
}

/**
 * This step validates that inventory levels are deletable. If the
 * inventory levels have reserved or incoming items, or the force
 * flag is not set and the inventory levels have stocked items, the
 * step will throw an error.
 *
 * :::note
 *
 * You can retrieve an inventory level's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validateInventoryLevelsDelete({
 *   inventoryLevels: [
 *     {
 *       id: "iilev_123",
 *       // other inventory level details...
 *     }
 *   ]
 * })
 */
export const validateInventoryLevelsDelete = createStep(
  "validate-inventory-levels-delete",
  async function ({
    inventoryLevels,
    force,
  }: ValidateInventoryLevelsDeleteStepInput) {
    const undeleteableDueToReservation = inventoryLevels.filter(
      (i) => i.reserved_quantity > 0 || i.incoming_quantity > 0
    )

    if (undeleteableDueToReservation.length) {
      const locationIds = deduplicate(
        undeleteableDueToReservation.map((item) => item.location_id)
      )
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot remove Inventory Levels for ${locationIds.join(
          ", "
        )} because there are reserved or incoming items at the locations`
      )
    }

    const undeleteableDueToStock = inventoryLevels.filter(
      (i) => !force && i.stocked_quantity > 0
    )

    if (undeleteableDueToStock.length) {
      const locationIds = deduplicate(
        undeleteableDueToStock.map((item) => item.location_id)
      )
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot remove Inventory Levels for ${locationIds.join(
          ", "
        )} because there are stocked items at the locations. Use force flag to delete anyway.`
      )
    }
  }
)

/**
 * The data to delete inventory levels. The inventory levels to be deleted
 * are selected based on the filters that you specify.
 */
export interface DeleteInventoryLevelsWorkflowInput
  extends FilterableInventoryLevelProps {
  /**
   * If true, the inventory levels will be deleted even if they have stocked items.
   */
  force?: boolean
}

export const deleteInventoryLevelsWorkflowId =
  "delete-inventory-levels-workflow"
/**
 * This workflow deletes one or more inventory levels. It's used by the
 * [Delete Inventory Levels Admin API Route](https://docs.medusajs.com/api/admin/inventory-items/remove-inventory-level).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete inventory levels in your custom flows.
 *
 * @example
 * const { result } = await deleteInventoryLevelsWorkflow(container)
 * .run({
 *   input: {
 *     id: ["iilev_123", "iilev_321"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more inventory levels.
 */
export const deleteInventoryLevelsWorkflow = createWorkflow(
  deleteInventoryLevelsWorkflowId,
  (input: WorkflowData<DeleteInventoryLevelsWorkflowInput>) => {
    const { filters, force } = transform(input, (data) => {
      const { force, ...filters } = data

      return {
        filters,
        force,
      }
    })

    const inventoryLevels = useRemoteQueryStep({
      entry_point: "inventory_levels",
      fields: ["id", "stocked_quantity", "reserved_quantity", "location_id"],
      variables: {
        filters: filters,
      },
    })

    validateInventoryLevelsDelete({ inventoryLevels, force })

    const idsToDelete = transform({ inventoryLevels }, ({ inventoryLevels }) =>
      inventoryLevels.map((il) => il.id)
    )

    deleteEntitiesStep({
      moduleRegistrationName: Modules.INVENTORY,
      invokeMethod: "softDeleteInventoryLevels",
      compensateMethod: "restoreInventoryLevels",
      data: idsToDelete,
    })

    const levelIdEvents = transform({ idsToDelete }, ({ idsToDelete }) => {
      return idsToDelete.map((id) => ({ id }))
    })

    emitEventStep({
      eventName: InventoryLevelWorkflowEvents.DELETED,
      data: levelIdEvents,
    })

    return new WorkflowResponse(void 0)
  }
)
