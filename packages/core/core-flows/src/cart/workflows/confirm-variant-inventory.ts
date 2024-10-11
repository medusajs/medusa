import { ConfirmVariantInventoryWorkflowInputDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { BigNumberInput } from "@medusajs/types"
import { confirmInventoryStep } from "../steps"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"

export interface ConfirmVariantInventoryWorkflowOutput {
  items: {
    id?: string
    inventory_item_id: string
    required_quantity: number
    allow_backorder: boolean
    quantity: BigNumberInput
    location_ids: string[]
  }[]
}

export const confirmVariantInventoryWorkflowId = "confirm-item-inventory"
/**
 * This workflow confirms for one or more variants that their inventory has a required quantity.
 */
export const confirmVariantInventoryWorkflow = createWorkflow(
  confirmVariantInventoryWorkflowId,
  (
    input: WorkflowData<ConfirmVariantInventoryWorkflowInputDTO>
  ): WorkflowResponse<ConfirmVariantInventoryWorkflowOutput> => {
    const confirmInventoryInput = transform(
      { input },
      prepareConfirmInventoryInput
    )

    confirmInventoryStep(confirmInventoryInput)

    return new WorkflowResponse(confirmInventoryInput)
  }
)
