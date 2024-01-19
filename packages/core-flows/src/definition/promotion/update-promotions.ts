import { PromotionDTO, UpdatePromotionDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { updatePromotionsStep } from "../../handlers/promotion"

type WorkflowInput = { promotionsData: UpdatePromotionDTO[] }
type WorkflowOutput = PromotionDTO[]

export const updatePromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("update-promotions", (input) => {
  return updatePromotionsStep(input.promotionsData)
})
