import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updatePriceListsStep, upsertPriceListPricesStep } from "../steps"

type WorkflowInput = { price_lists_data: UpdatePriceListWorkflowInputDTO[] }

export const updatePriceListsWorkflowId = "update-price-lists"
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    upsertPriceListPricesStep(input.price_lists_data)

    const updatePriceListInput = transform({ input }, (data) => {
      return data.input.price_lists_data.map((priceListData) => {
        delete priceListData.prices

        return priceListData
      })
    })

    updatePriceListsStep(updatePriceListInput)
  }
)
