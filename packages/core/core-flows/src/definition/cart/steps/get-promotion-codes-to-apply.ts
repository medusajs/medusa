import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { PromotionActions } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
  promo_codes?: string[]
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const getPromotionCodesToApplyId = "get-promotion-codes-to-apply"
export const getPromotionCodesToApply = createStep(
  getPromotionCodesToApplyId,
  async (data: StepInput, { container }) => {
    const { promo_codes = [], cart, action = PromotionActions.ADD } = data
    const { items = [] } = cart
    const adjustmentCodes: string[] = []
    const promotionService = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    for (const item of items) {
      for (const adjustment of item.adjustments || []) {
        if (adjustment.code && !adjustmentCodes.includes(adjustment.code)) {
          adjustmentCodes.push(adjustment.code)
        }
      }
    }

    let promotionCodesToApply: string[] = (
      await promotionService.list(
        { code: adjustmentCodes },
        { select: ["code"], take: null }
      )
    ).map((p) => p.code!)

    if (action === PromotionActions.ADD) {
      promotionCodesToApply.push(...promo_codes)
    }

    if (action === PromotionActions.REMOVE) {
      promotionCodesToApply = promotionCodesToApply.filter(
        (code) => !promo_codes.includes(code!)
      )
    }

    if (action === PromotionActions.REPLACE) {
      promotionCodesToApply = promo_codes
    }

    return new StepResponse(promotionCodesToApply)
  }
)
