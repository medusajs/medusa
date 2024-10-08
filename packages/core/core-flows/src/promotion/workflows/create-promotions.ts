import { AdditionalData, CreatePromotionDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPromotionsStep } from "../steps"

export type CreatePromotionsWorkflowInput = {
  promotionsData: CreatePromotionDTO[]
} & AdditionalData

export const createPromotionsWorkflowId = "create-promotions"
/**
 * This workflow creates one or more promotions.
 */
export const createPromotionsWorkflow = createWorkflow(
  createPromotionsWorkflowId,
  (input: WorkflowData<CreatePromotionsWorkflowInput>) => {
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
