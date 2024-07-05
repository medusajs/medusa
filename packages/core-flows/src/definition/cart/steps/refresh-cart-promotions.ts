import { PromotionActions } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { updateCartPromotionsWorkflow } from "../workflows"

interface StepInput {
  id: string
  promo_codes?: string[]
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

export const refreshCartPromotionsStepId = "refresh-cart-promotions"
export const refreshCartPromotionsStep = createStep(
  refreshCartPromotionsStepId,
  async (data: StepInput, { container }) => {
    const { promo_codes = [], id, action = PromotionActions.ADD } = data

    await updateCartPromotionsWorkflow(container).run({
      input: {
        action,
        promoCodes: promo_codes,
        cartId: id,
      },
    })

    return new StepResponse(null)
  }
)
