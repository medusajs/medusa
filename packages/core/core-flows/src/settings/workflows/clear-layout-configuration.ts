import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { clearLayoutConfigurationStep } from "../steps"

export type ClearLayoutConfigurationWorkflowInput = {
  zone: string
  user_id: string
}

export const clearLayoutConfigurationWorkflowId = "clear-layout-configuration"

export const clearLayoutConfigurationWorkflow = createWorkflow(
  clearLayoutConfigurationWorkflowId,
  (input: WorkflowData<ClearLayoutConfigurationWorkflowInput>) => {
    clearLayoutConfigurationStep(input)

    return new WorkflowResponse(void 0)
  }
)
