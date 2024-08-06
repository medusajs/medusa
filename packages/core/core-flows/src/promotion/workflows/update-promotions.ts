import {
  AdditionalData,
  UpdatePromotionDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updatePromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: UpdatePromotionDTO[] } & AdditionalData

export const updatePromotionsWorkflowId = "update-promotions"
export const updatePromotionsWorkflow = createWorkflow(
  updatePromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
