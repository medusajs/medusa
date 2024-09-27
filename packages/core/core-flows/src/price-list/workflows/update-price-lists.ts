import { UpdatePriceListWorkflowInputDTO } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { updatePriceListsStep, validatePriceListsStep } from "../steps"

export const updatePriceListsWorkflowId = "update-price-lists"
/**
 * This workflow updates one or more price lists.
 */
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (
    input: WorkflowData<{ price_lists_data: UpdatePriceListWorkflowInputDTO[] }>
  ): WorkflowData<void> => {
    validatePriceListsStep(input.price_lists_data)

    updatePriceListsStep(input.price_lists_data)
  }
)
