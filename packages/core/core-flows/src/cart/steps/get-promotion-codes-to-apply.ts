import { IPromotionModuleService } from "@medusajs/framework/types"
import { Modules, PromotionActions } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface GetPromotionCodesToApplyStepInput {
  cart: {
    items?: { adjustments?: { code?: string }[] }[]
    shipping_methods?: { adjustments?: { code?: string }[] }[]
  }
  promo_codes?: string[]
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const getPromotionCodesToApplyId = "get-promotion-codes-to-apply"
/**
 * This step retrieves the promotion codes to apply on a cart.
 */
export const getPromotionCodesToApply = createStep(
  getPromotionCodesToApplyId,
  async (data: GetPromotionCodesToApplyStepInput, { container }) => {
    const { promo_codes = [], cart, action = PromotionActions.ADD } = data
    const { items = [], shipping_methods = [] } = cart
    const adjustmentCodes: string[] = []
    const promotionService = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const objects = items.concat(shipping_methods)

    objects.forEach((object) => {
      object.adjustments?.forEach((adjustment) => {
        if (adjustment.code && !adjustmentCodes.includes(adjustment.code)) {
          adjustmentCodes.push(adjustment.code)
        }
      })
    })

    const promotionCodesToApply: Set<string> = new Set(
      (
        await promotionService.listPromotions(
          { code: adjustmentCodes },
          { select: ["code"] }
        )
      ).map((p) => p.code!)
    )

    if (action === PromotionActions.ADD) {
      promo_codes.forEach((code) => promotionCodesToApply.add(code))
    }

    if (action === PromotionActions.REMOVE) {
      promo_codes.forEach((code) => promotionCodesToApply.delete(code))
    }

    if (action === PromotionActions.REPLACE) {
      promotionCodesToApply.clear()
      promo_codes.forEach((code) => promotionCodesToApply.add(code))
    }

    return new StepResponse(Array.from(promotionCodesToApply))
  }
)
