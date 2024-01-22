import { PromotionDTO, UpdatePromotionDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { updatePromotionsStep } from "../../handlers/promotion"

type WorkflowInput = { promotionsData: UpdatePromotionDTO[] }
type WorkflowOutput = PromotionDTO[]

export const updatePromotionsWorkflowId = "update-promotions"
export const updatePromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>(updatePromotionsWorkflowId, (input) => {
  return updatePromotionsStep(input.promotionsData)
})
