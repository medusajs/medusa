import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { isString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
  promoCodes: string[]
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: StepInput, { container }) => {
    const promotionModuleService: IPromotionModuleService = container.resolve(
      ModuleRegistrationName.PROMOTION
    )

    const appliedCartPromoCodes = data.cart.items
      ?.map((item) => item.adjustments?.map((adjustment) => adjustment.code))
      .flat(1)
      .filter(isString) as string[]

    const actionsToCompute = await promotionModuleService.computeActions(
      [...data.promoCodes, ...appliedCartPromoCodes],
      data.cart as any
    )

    return new StepResponse(actionsToCompute)
  }
)
