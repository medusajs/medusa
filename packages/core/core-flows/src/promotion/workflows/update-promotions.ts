import { AdditionalData, UpdatePromotionDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updatePromotionsStep } from "../steps"

export type UpdatePromotionsWorkflowInput = {
  promotionsData: UpdatePromotionDTO[]
} & AdditionalData

export const updatePromotionsWorkflowId = "update-promotions"
/**
 * This workflow updates one or more promotions.
 */
export const updatePromotionsWorkflow = createWorkflow(
  updatePromotionsWorkflowId,
  (input: WorkflowData<UpdatePromotionsWorkflowInput>) => {
    const updatedPromotions = updatePromotionsStep(input.promotionsData)
    const promotionsUpdated = createHook("promotionsUpdated", {
      promotions: updatedPromotions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedPromotions, {
      hooks: [promotionsUpdated],
    })
  }
)
