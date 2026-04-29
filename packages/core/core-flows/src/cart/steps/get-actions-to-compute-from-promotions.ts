import {
  ComputeActionContext,
  ComputeActionOptions,
  IPromotionModuleService
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the items and shipping methods and its applied promotions.
 */
export interface GetActionsToComputeFromPromotionsStepInput {
  /**
   * The items and shipping methods to compute the actions for.
   */
  computeActionContext: ComputeActionContext
  /**
   * The promotion codes applied on the items and shipping methods.
   */
  promotionCodesToApply: string[]
  /**
   * The options to configure how the actions are computed.
   */
  options?: ComputeActionOptions
}

export const getActionsToComputeFromPromotionsStepId =
  "get-actions-to-compute-from-promotions"
/**
 * This step retrieves the actions to compute based on the promotions
 * applied on items and shipping methods.
 *
 * :::tip
 *
 * You can use the {@link retrieveCartStep} to retrieve items and shipping methods' details.
 *
 * :::
 *
 * @example
 * const data = getActionsToComputeFromPromotionsStep({
 *   // retrieve the details of the items and shipping methods from another workflow
 *   // or in another step using the Cart Module's service
 *   computeActionContext,
 *   promotionCodesToApply: ["10OFF"]
 * })
 */
export const getActionsToComputeFromPromotionsStep = createStep(
  getActionsToComputeFromPromotionsStepId,
  async (data: GetActionsToComputeFromPromotionsStepInput, { container }) => {
    const { computeActionContext, promotionCodesToApply = [], options } = data

    
    const promotionService = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )
    
    const actionsToCompute = await promotionService.computeActions(
      promotionCodesToApply,
      computeActionContext,
      options
    )

    return new StepResponse(actionsToCompute)
  }
)
