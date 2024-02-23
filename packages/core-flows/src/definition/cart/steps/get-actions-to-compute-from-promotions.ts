import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { deduplicate, isString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
  promoCodes: string[]
  removePromotions: boolean
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: StepInput, { container }) => {
    const promotionModuleService: IPromotionModuleService = container.resolve(
      ModuleRegistrationName.PROMOTION
    )

    const { removePromotions = false, promoCodes = [], cart } = data

    const appliedItemPromoCodes = cart.items
      ?.map((item) => item.adjustments?.map((adjustment) => adjustment.code))
      .flat(1)
      .filter(isString) as string[]

    const appliedShippingMethodPromoCodes = cart.shipping_methods
      ?.map((shippingMethod) =>
        shippingMethod.adjustments?.map((adjustment) => adjustment.code)
      )
      .flat(1)
      .filter(isString) as string[]

    let promotionCodesToApply = deduplicate([
      ...promoCodes,
      ...appliedItemPromoCodes,
      ...appliedShippingMethodPromoCodes,
    ])

    if (removePromotions) {
      promotionCodesToApply = promotionCodesToApply.filter(
        (code) => !promoCodes.includes(code)
      )
    }

    const actionsToCompute = await promotionModuleService.computeActions(
      promotionCodesToApply,
      cart as any
    )

    return new StepResponse(actionsToCompute)
  }
)
