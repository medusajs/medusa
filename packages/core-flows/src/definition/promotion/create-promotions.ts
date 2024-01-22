import { CreatePromotionDTO, PromotionDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { createPromotionsStep } from "../../handlers/promotion"

type WorkflowInput = { promotionsData: CreatePromotionDTO[] }
type WorkflowOutput = PromotionDTO[]

export const createPromotionsWorkflowId = "create-promotions"
export const createPromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>(createPromotionsWorkflowId, (input) => {
  return createPromotionsStep(input.promotionsData)
})
