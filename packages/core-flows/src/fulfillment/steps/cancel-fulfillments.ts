import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const cancelFulfillmentsStepId = "cancel-fulfillments"
export const cancelFulfillmentsStep = createStep(
  cancelFulfillmentsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await promiseAll(ids.map((id) => service.cancelFulfillment(id)))

    return new StepResponse(void 0, ids)
  }
)
