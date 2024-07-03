import { DeleteEntityInput } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { ModuleRegistrationName, Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteShippingOptionsStepId = "delete-shipping-options-step"
export const deleteShippingOptionsStep = createStep(
  deleteShippingOptionsStepId,
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const softDeletedEntities = await service.softDeleteShippingOptions(ids)

    return new StepResponse(
      {
        [Modules.FULFILLMENT]: softDeletedEntities,
      } as DeleteEntityInput,
      ids
    )
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.restoreShippingOptions(prevIds)
  }
)
