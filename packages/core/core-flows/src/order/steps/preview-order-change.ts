import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const previewOrderChangeStepId = "preview-order-change"
/**
 * This step retrieves a preview of an order change.
 */
export const previewOrderChangeStep = createStep(
  previewOrderChangeStepId,
  async (orderId: string, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const preview = await service.previewOrderChange(orderId)

    return new StepResponse(preview)
  }
)
