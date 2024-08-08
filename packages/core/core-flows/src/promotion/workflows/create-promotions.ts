import { AdditionalData, CreatePromotionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createPromotionsStep } from "../steps"

type WorkflowInput = { promotionsData: CreatePromotionDTO[] } & AdditionalData

export const createPromotionsWorkflowId = "create-promotions"
export const createPromotionsWorkflow = createWorkflow(
  createPromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const createdPromotions = createPromotionsStep(input.promotionsData)
    const promotionsCreated = createHook("promotionsCreated", {
      promotions: createdPromotions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdPromotions, {
      hooks: [promotionsCreated],
    })
  }
)
