import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { PromotionActions } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
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
export const getPromotionCodesToApply = createStep(
  getPromotionCodesToApplyId,
  async (data: StepInput, { container }) => {
    const { promo_codes = [], cart, action = PromotionActions.ADD } = data
    const { items = [], shipping_methods = [] } = cart
    const adjustmentCodes: string[] = []
    const promotionService = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const objects = items.concat(shipping_methods)

    objects.forEach(object => {
      object.adjustments?.forEach(adjustment => {
        if (adjustment.code && !adjustmentCodes.includes(adjustment.code)) {
          adjustmentCodes.push(adjustment.code)
        }
      })
    })

    const promotionCodesToApply: Set<string> = new Set((
      await promotionService.list(
        { code: adjustmentCodes },
        { select: ["code"], take: null }
      )
    ).map((p) => p.code!))

    if (action === PromotionActions.ADD) {
      promo_codes.forEach(promotionCodesToApply.add)
    }

    if (action === PromotionActions.REMOVE) {
      promo_codes.forEach(promotionCodesToApply.delete)
    }

    if (action === PromotionActions.REPLACE) {
      promotionCodesToApply.clear()
      promo_codes.forEach(promotionCodesToApply.add)
    }

    return new StepResponse(Array.from(promotionCodesToApply))
  }
)
