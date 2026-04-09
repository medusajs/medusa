import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deletePropertyLabelsStep } from "../steps"

export interface DeletePropertyLabelsWorkflowInput {
  ids: string[]
}

export const deletePropertyLabelsWorkflowId = "delete-property-labels"

/**
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const deletePropertyLabelsWorkflow = createWorkflow(
  deletePropertyLabelsWorkflowId,
  (
    input: WorkflowData<DeletePropertyLabelsWorkflowInput>
  ): WorkflowResponse<void> => {
    deletePropertyLabelsStep(input)

    return new WorkflowResponse(void 0)
  }
)
