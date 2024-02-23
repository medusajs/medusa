import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddItemAdjustmentAction,
  AddShippingMethodAdjustment,
  ComputeActions,
  IPromotionModuleService,
  PromotionDTO,
  RemoveItemAdjustmentAction,
  RemoveShippingMethodAdjustment,
} from "@medusajs/types"
import { ComputedActions } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  actionsToCompute: ComputeActions[]
}

export const prepareAdjustmentsFromPromotionsStepId =
  "prepare-adjustments-from-promotions"
export const prepareAdjustmentsFromPromotionsStep = createStep(
  prepareAdjustmentsFromPromotionsStepId,
  async (data: StepInput, { container }) => {
    const promotionModuleService: IPromotionModuleService = container.resolve(
      ModuleRegistrationName.PROMOTION
    )

    const { actionsToCompute = [] } = data
    const promotions = await promotionModuleService.list(
      { code: actionsToCompute.map((a) => a.code) },
      { select: ["id", "code"] }
    )

    const promotionsMap = new Map<string, PromotionDTO>(
      promotions.map((promotion) => [promotion.code!, promotion])
    )

    const lineItemAdjustmentsToCreate = actionsToCompute
      .filter((a) => a.action === ComputedActions.ADD_ITEM_ADJUSTMENT)
      .map((action) => ({
        code: action.code,
        amount: (action as AddItemAdjustmentAction).amount,
        item_id: (action as AddItemAdjustmentAction).item_id,
        promotion_id: promotionsMap.get(action.code)?.id,
      }))

    const lineItemAdjustmentIdsToRemove = actionsToCompute
      .filter((a) => a.action === ComputedActions.REMOVE_ITEM_ADJUSTMENT)
      .map((a) => (a as RemoveItemAdjustmentAction).adjustment_id)

    const shippingMethodAdjustmentsToCreate = actionsToCompute
      .filter(
        (a) => a.action === ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT
      )
      .map((action) => ({
        code: action.code,
        amount: (action as AddShippingMethodAdjustment).amount,
        shipping_method_id: (action as AddShippingMethodAdjustment)
          .shipping_method_id,
        promotion_id: promotionsMap.get(action.code)?.id,
      }))

    const shippingMethodAdjustmentIdsToRemove = actionsToCompute
      .filter(
        (a) => a.action === ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT
      )
      .map((a) => (a as RemoveShippingMethodAdjustment).adjustment_id)

    return new StepResponse({
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
    })
  }
)
