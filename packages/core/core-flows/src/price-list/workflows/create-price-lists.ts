import { CreatePriceListWorkflowInputDTO, PriceListDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createPriceListsStep, validateVariantPriceLinksStep } from "../steps"

export type CreatePriceListsWorkflowInput = { price_lists_data: CreatePriceListWorkflowInputDTO[] }

export const createPriceListsWorkflowId = "create-price-lists"
/**
 * This workflow creates one or more price lists.
 */
export const createPriceListsWorkflow = createWorkflow(
  createPriceListsWorkflowId,
  (input: WorkflowData<CreatePriceListsWorkflowInput>): WorkflowResponse<PriceListDTO[]> => {
    const variantPriceMap = validateVariantPriceLinksStep(
      input.price_lists_data
    )

    return new WorkflowResponse(
      createPriceListsStep({
        data: input.price_lists_data,
        variant_price_map: variantPriceMap,
      })
    )
  }
)
