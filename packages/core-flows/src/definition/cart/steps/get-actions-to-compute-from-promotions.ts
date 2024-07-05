import { LinkModuleUtils, ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, IPromotionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: StepInput, { container }) => {
    const { cart } = data
    const remoteQuery = container.resolve(LinkModuleUtils.REMOTE_QUERY)
    const promotionService = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const existingCartPromotionLinks = await remoteQuery({
      cart_promotion: {
        __args: { cart_id: [cart.id] },
        fields: ["id", "cart_id", "promotion_id", "deleted_at"],
      },
    })

    const existingPromotions = await promotionService.list(
      { id: existingCartPromotionLinks.map((l) => l.promotion_id) },
      { take: null, select: ["code"] }
    )

    const actionsToCompute = await promotionService.computeActions(
      existingPromotions.map((p) => p.code!),
      cart as any
    )

    return new StepResponse(actionsToCompute)
  }
)
