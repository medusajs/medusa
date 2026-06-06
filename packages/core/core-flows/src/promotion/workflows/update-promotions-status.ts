import {
  AdditionalData,
  PromotionStatusValues,
} from "@zjedene-medusa/framework/types"
import { MedusaError, PromotionStatus } from "@zjedene-medusa/framework/utils"
import {
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updatePromotionsStep } from "../steps"

/**
 * The data to update the status of one or more promotions.
 */
export type UpdatePromotionsStatusWorkflowInput = {
  /**
   * The promotions to update their status.
   */
  promotionsData: {
    /**
     * The ID of the promotion.
     */
    id: string
    /**
     * The new status of the promotion.
     */
    status: PromotionStatusValues
  }[]
} & AdditionalData

export const updatePromotionsValidationStep = createStep(
  "update-promotions-validation",
  async function ({ promotionsData }: UpdatePromotionsStatusWorkflowInput) {
    for (const promotionData of promotionsData) {
      const allowedStatuses: PromotionStatusValues[] =
        Object.values(PromotionStatus)

      if (!allowedStatuses.includes(promotionData.status)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `promotion's status should be one of - ${allowedStatuses.join(", ")}`
        )
      }
    }
  }
)

export const updatePromotionsStatusWorkflowId = "update-promotions-status"
/**
 * This workflow updates the status of one or more promotions.
 * 
 * This workflow has a hook that allows you to perform custom actions on the updated promotions. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the promotions.
 * 
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to
 * update the status of promotions within your custom flows.
 * 
 * @example
 * const { result } = await updatePromotionsStatusWorkflow(container)
 * .run({
 *   input: {
 *     promotionsData: {
 *       id: "promo_123",
 *       status: "active"
 *     },
 *     additional_data: {
 *       external_id: "ext_123"
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Update the status of one or more promotions.
 * 
 * @property hooks.promotionStatusUpdated - This hook is executed after the promotions' status is updated. You can consume this hook to perform custom actions on the updated promotions.
 */
export const updatePromotionsStatusWorkflow = createWorkflow(
  updatePromotionsStatusWorkflowId,
  (input: UpdatePromotionsStatusWorkflowInput) => {
    updatePromotionsValidationStep(input)

    const updatedPromotions = updatePromotionsStep(input.promotionsData)

    const promotionStatusUpdated = createHook("promotionStatusUpdated", {
      promotions: updatedPromotions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedPromotions, {
      hooks: [promotionStatusUpdated],
    })
  }
)
