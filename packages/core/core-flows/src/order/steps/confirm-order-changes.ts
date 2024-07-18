import { OrderChangeDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type ConfirmOrderChangesInput = {
  orderId: string
  changes: OrderChangeDTO[]
}

export const confirmOrderChanges = createStep(
  "confirm-order-changes",
  async (input: ConfirmOrderChangesInput, { container }) => {
    const orderModuleService = container.resolve(ModuleRegistrationName.ORDER)
    await orderModuleService.confirmOrderChange(
      input.changes.map((action) => action.id)
    )

    return new StepResponse(null, input.orderId)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const orderModuleService = container.resolve(ModuleRegistrationName.ORDER)
    await orderModuleService.revertLastVersion(orderId)
  }
)
