import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { clearLayoutConfigurationStep, setActiveLayoutScopeStep } from "../steps"

export type ClearLayoutConfigurationWorkflowInput = {
  zone: string
  user_id: string
}

export const clearLayoutConfigurationWorkflowId = "clear-layout-configuration"

export const clearLayoutConfigurationWorkflow = createWorkflow(
  clearLayoutConfigurationWorkflowId,
  (input: WorkflowData<ClearLayoutConfigurationWorkflowInput>) => {
    clearLayoutConfigurationStep(input)

    setActiveLayoutScopeStep(input)

    return new WorkflowResponse(void 0)
  }
)
