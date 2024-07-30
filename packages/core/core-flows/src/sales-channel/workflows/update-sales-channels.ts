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

type UpdateSalesChannelsStepInput = {
  selector: FilterableSalesChannelProps
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsWorkflowId = "update-sales-channels"
export const updateSalesChannelsWorkflow = createWorkflow(
  updateSalesChannelsWorkflowId,
  (
    input: WorkflowData<UpdateSalesChannelsStepInput>
  ): WorkflowResponse<WorkflowData<SalesChannelDTO[]>> => {
    return new WorkflowResponse(updateSalesChannelsStep(input))
  }
)
