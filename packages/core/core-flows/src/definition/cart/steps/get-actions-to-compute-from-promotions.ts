import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface GetActionsToComputeFromPromotionsStepInput {
  cart: CartDTO
  promotionCodesToApply: string[]
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
/**
 * This step retrieves the actions to compute based on the promotions
 * applied on a cart.
 */
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: GetActionsToComputeFromPromotionsStepInput, { container }) => {
    const { cart, promotionCodesToApply = [] } = data
    const promotionService = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const actionsToCompute = await promotionService.computeActions(
      promotionCodesToApply,
      cart as any
    )

    return new StepResponse(actionsToCompute)
  }
)
