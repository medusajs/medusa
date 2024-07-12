import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const previewOrderChangeStepId = "preview-order-change"
export const previewOrderChangeStep = createStep(
  previewOrderChangeStepId,
  async (orderId: string, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const preview = await service.previewOrderChange(orderId)

    return new StepResponse(preview)
  }
)
