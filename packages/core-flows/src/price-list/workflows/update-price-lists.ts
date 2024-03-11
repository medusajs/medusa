import { PriceListDTO, UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updatePriceListsStep } from "../steps"

type WorkflowInput = { price_lists_data: UpdatePriceListWorkflowInputDTO[] }

export const updatePriceListsWorkflowId = "update-price-lists"
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PriceListDTO[]> => {
    return updatePriceListsStep(input.price_lists_data)
  }
)
