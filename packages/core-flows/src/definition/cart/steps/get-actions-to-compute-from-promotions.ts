import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { PromotionActions, deduplicate, isString } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
  promoCodes?: string[]
  action:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: StepInput, { container }) => {
    const promotionModuleService: IPromotionModuleService = container.resolve(
      ModuleRegistrationName.PROMOTION
    )

    const { action = PromotionActions.ADD, promoCodes, cart } = data

    if (!Array.isArray(promoCodes)) {
      return new StepResponse([])
    }

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

    if (action === PromotionActions.REMOVE) {
      promotionCodesToApply = promotionCodesToApply.filter(
        (code) => !promoCodes.includes(code)
      )
    }

    if (action === PromotionActions.REPLACE) {
      promotionCodesToApply = promoCodes
    }

    const actionsToCompute = await promotionModuleService.computeActions(
      promotionCodesToApply,
      cart as any
    )

    return new StepResponse(actionsToCompute)
  }
)
