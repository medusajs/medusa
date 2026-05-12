import {
  ComputeActionContext,
  ComputeActionOptions,
  IPromotionModuleService,
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
  /**
   * The result of the `additional_promotion_context` hook, forwarded by the calling
   * workflow. Its keys are merged on top of `computeActionContext` before
   * promotion rules are evaluated, so consumers can extend the rule evaluation
   * context with arbitrary attributes (e.g. `company.id`, "custom_tier").
   *
   * Values from `additional_promotion_context` take precedence over values on
   * `computeActionContext` when keys conflict.
   */
  additional_promotion_context?: Record<string, unknown>
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
    const {
      computeActionContext,
      promotionCodesToApply = [],
      options,
      additional_promotion_context: setPromotionContextResult,
    } = data

    const promotionService = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const mergedContext: ComputeActionContext = {
      ...computeActionContext,
      ...(setPromotionContextResult ?? {}),
    }

    const actionsToCompute = await promotionService.computeActions(
      promotionCodesToApply,
      mergedContext,
      options
    )

    return new StepResponse(actionsToCompute)
  }
)
