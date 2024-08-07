import { ConfirmVariantInventoryWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { confirmInventoryStep } from "../steps"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"

interface Output {
  items: {
    id?: string
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: number
    location_ids: string[]
  }[]
}

export const confirmVariantInventoryWorkflowId = "confirm-item-inventory"
export const confirmVariantInventoryWorkflow = createWorkflow(
  confirmVariantInventoryWorkflowId,
  (
    input: WorkflowData<ConfirmVariantInventoryWorkflowInputDTO>
  ): WorkflowResponse<Output> => {
    const confirmInventoryInput = transform(
      { input },
      prepareConfirmInventoryInput
    )

    confirmInventoryStep(confirmInventoryInput)

    return new WorkflowResponse(confirmInventoryInput)
  }
)
