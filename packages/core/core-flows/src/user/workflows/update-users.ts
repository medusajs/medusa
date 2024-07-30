import { UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const updateUsersWorkflowId = "update-users-workflow"
export const updateUsersWorkflow = createWorkflow(
  updateUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.UpdateUsersWorkflowInputDTO>
  ): WorkflowResponse<WorkflowData<UserDTO[]>> => {
    return new WorkflowResponse(updateUsersStep(input.updates))
  }
)
