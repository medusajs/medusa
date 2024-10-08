import {
  AddItemAdjustmentAction,
  AddShippingMethodAdjustment,
  ComputeActions,
  IPromotionModuleService,
  PromotionDTO,
  RemoveItemAdjustmentAction,
  RemoveShippingMethodAdjustment,
} from "@medusajs/framework/types"
import { ComputedActions, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface PrepareAdjustmentsFromPromotionActionsStepInput {
  actions: ComputeActions[]
}

export const prepareAdjustmentsFromPromotionActionsStepId =
  "prepare-adjustments-from-promotion-actions"
/**
 * This step prepares the line item or shipping method adjustments using
 * actions computed by the Promotion Module.
 */
export const prepareAdjustmentsFromPromotionActionsStep = createStep(
  prepareAdjustmentsFromPromotionActionsStepId,
  async (
    data: PrepareAdjustmentsFromPromotionActionsStepInput,
    { container }
  ) => {
    const promotionModuleService: IPromotionModuleService = container.resolve(
      Modules.PROMOTION
    )

    const { actions = [] } = data
    const promotions = await promotionModuleService.listPromotions(
      { code: actions.map((a) => a.code) },
      { select: ["id", "code"] }
    )

    const promotionsMap = new Map<string, PromotionDTO>(
      promotions.map((promotion) => [promotion.code!, promotion])
    )

    const lineItemAdjustmentsToCreate = actions
      .filter((a) => a.action === ComputedActions.ADD_ITEM_ADJUSTMENT)
      .map((action) => ({
        code: action.code,
        amount: (action as AddItemAdjustmentAction).amount,
        item_id: (action as AddItemAdjustmentAction).item_id,
        promotion_id: promotionsMap.get(action.code)?.id,
      }))

    const lineItemAdjustmentIdsToRemove = actions
      .filter((a) => a.action === ComputedActions.REMOVE_ITEM_ADJUSTMENT)
      .map((a) => (a as RemoveItemAdjustmentAction).adjustment_id)

    const shippingMethodAdjustmentsToCreate = actions
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

    const shippingMethodAdjustmentIdsToRemove = actions
      .filter(
        (a) => a.action === ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT
      )
      .map((a) => (a as RemoveShippingMethodAdjustment).adjustment_id)

    const computedPromotionCodes = [
      ...lineItemAdjustmentsToCreate,
      ...shippingMethodAdjustmentsToCreate,
    ].map((adjustment) => adjustment.code)

    return new StepResponse({
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
      computedPromotionCodes,
    })
  }
)
