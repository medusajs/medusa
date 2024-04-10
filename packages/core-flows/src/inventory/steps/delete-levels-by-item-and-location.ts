import { ICustomerModuleService, IInventoryServiceNext } from "@medusajs/types"
import { StepResponse, WorkflowData, createStep } from "@medusajs/workflows-sdk"

import { MedusaError } from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const deleteInventoryLevelsFromItemAndLocationsStepId =
  "delete-inventory-levels-from-item-and-location-step"
export const deleteInventoryLevelsFromItemAndLocationsStep = createStep(
  deleteInventoryLevelsFromItemAndLocationsStepId,
  async (
    input: { inventory_item_id: string; location_id: string }[],
    { container }
  ) => {
    if (!input.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    const items = await service.listInventoryLevels({ $or: input }, {})

    if (items.some((i) => i.reserved_quantity > 0)) {
      const invalidDeletes = items.filter((i) => i.reserved_quantity > 0)
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot remove Inventory Levels for ${invalidDeletes
          .map((i) => `Inventory Level ${i.id} at Location ${i.location_id}`)
          .join(
            ", "
          )} because there are reserved quantities for items at locations`
      )
    }

    const deletedIds = items.map((i) => i.id)
    const deleted = await service.softDeleteInventoryLevels(deletedIds)

    return new StepResponse({
      ModuleRegistrationName.INVENTORY: deleted
    }, deletedIds)
  },
  async (prevLevelIds, { container }) => {
    if (!prevLevelIds?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreInventoryLevels(prevLevelIds)
  }
)
