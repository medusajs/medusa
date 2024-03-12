import { CreatePriceListWorkflowInputDTO, PriceListDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPriceListsStep, validateVariantPriceLinksStep } from "../steps"

type WorkflowInput = { price_lists_data: CreatePriceListWorkflowInputDTO[] }

export const createPriceListsWorkflowId = "create-price-lists"
export const createPriceListsWorkflow = createWorkflow(
  createPriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<PriceListDTO[]> => {
    const variantPriceMap = validateVariantPriceLinksStep(
      input.price_lists_data
    )

    return createPriceListsStep({
      data: input.price_lists_data,
      variant_price_map: variantPriceMap,
    })
  }
)
