import { PromotionDTO, UpdatePromotionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updatePromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: UpdatePromotionDTO[] }

export const updatePromotionsWorkflowId = "update-promotions"
export const updatePromotionsWorkflow = createWorkflow(
  updatePromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<PromotionDTO[]> => {
    return new WorkflowResponse(updatePromotionsStep(input.promotionsData))
  }
)
