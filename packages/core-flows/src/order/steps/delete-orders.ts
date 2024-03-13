import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteOrdersStepId = "delete-orders"
export const deleteOrdersStep = createStep(
  deleteOrdersStepId,
  async (ids: string[], { container }) => {
    const storeModule = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.STORE
    )

    await storeModule.softDelete(ids)
    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const storeModule = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.STORE
    )

    await storeModule.restore(idsToRestore)
  }
)
