import {
  OrderChangeDTO,
  UpdateOrderChangeActionDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updateOrderChangesStep } from "../steps"

export const updateOrderChangesWorkflowId = "update-order-change"
/**
 * This workflow updates one or more order changes.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * updating order changes.
 * 
 * @summary
 * 
 * Update one or more order changes.
 */
export const updateOrderChangesWorkflow = createWorkflow(
  updateOrderChangesWorkflowId,
  (
    input: WorkflowData<UpdateOrderChangeActionDTO[]>
  ): WorkflowResponse<OrderChangeDTO[]> => {
    return new WorkflowResponse(updateOrderChangesStep(input))
  }
)
