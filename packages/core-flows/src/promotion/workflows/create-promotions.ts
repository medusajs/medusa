import { CreatePromotionDTO, PromotionDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: CreatePromotionDTO[] }

export const createPromotionsWorkflowId = "create-promotions"
export const createPromotionsWorkflow = createWorkflow(
  createPromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PromotionDTO[]> => {
    return createPromotionsStep(input.promotionsData)
  }
)
