import { CreatePromotionDTO, PromotionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createPromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: CreatePromotionDTO[] }

export const createPromotionsWorkflowId = "create-promotions"
export const createPromotionsWorkflow = createWorkflow(
  createPromotionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<PromotionDTO[]>> => {
    return new WorkflowResponse(createPromotionsStep(input.promotionsData))
  }
)
