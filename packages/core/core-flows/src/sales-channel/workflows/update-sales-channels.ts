import {
  FilterableSalesChannelProps,
  SalesChannelDTO,
  UpdateSalesChannelDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateSalesChannelsStep } from "../steps/update-sales-channels"

export type UpdateSalesChannelsWorkflowInput = {
  selector: FilterableSalesChannelProps
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsWorkflowId = "update-sales-channels"
/**
 * This workflow updates sales channels matching the specified conditions.
 */
export const updateSalesChannelsWorkflow = createWorkflow(
  updateSalesChannelsWorkflowId,
  (
    input: WorkflowData<UpdateSalesChannelsWorkflowInput>
  ): WorkflowResponse<SalesChannelDTO[]> => {
    return new WorkflowResponse(updateSalesChannelsStep(input))
  }
)
