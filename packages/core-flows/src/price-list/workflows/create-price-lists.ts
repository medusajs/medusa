import { CreatePriceListWorkflowInputDTO, PriceListDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPriceListsStep } from "../steps"

type WorkflowInput = { priceListsData: CreatePriceListWorkflowInputDTO[] }

export const createPriceListsWorkflowId = "create-price-lists"
export const createPriceListsWorkflow = createWorkflow(
  createPriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PriceListDTO[]> => {
    return createPriceListsStep(input.priceListsData)
  }
)
