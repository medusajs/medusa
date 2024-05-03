import { PromotionDTO, UpdatePromotionDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updatePromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: UpdatePromotionDTO[] }

export const updatePromotionsWorkflowId = "update-promotions"
export const updatePromotionsWorkflow = createWorkflow(
  updatePromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PromotionDTO[]> => {
    return updatePromotionsStep(input.promotionsData)
  }
)
