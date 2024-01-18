import { CreatePromotionDTO, PromotionDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { createPromotionsStep } from "../../handlers/promotion"

type WorkflowInput = {
  promotionsData: CreatePromotionDTO[]
}

type WorkflowOutput = PromotionDTO[]

export const createPromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("create-promotions", (input) => {
  return createPromotionsStep(input.promotionsData)
})
