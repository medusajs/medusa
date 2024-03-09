import { PriceListDTO, UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updatePriceListsStep } from "../steps"

type WorkflowInput = { priceListsData: UpdatePriceListWorkflowInputDTO[] }

export const updatePriceListsWorkflowId = "update-price-lists"
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PriceListDTO[]> => {
    return updatePriceListsStep(input.priceListsData)
  }
)
