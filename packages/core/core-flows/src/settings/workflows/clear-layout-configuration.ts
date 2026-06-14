import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
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

    // Drop any persisted active-scope choice so the zone falls back to natural
    // resolution (the default, now that the personal config is gone).
    const scopeInput = transform({ input }, ({ input }) => ({
      zone: input.zone,
      user_id: input.user_id,
      scope: null,
    }))
    setActiveLayoutScopeStep(scopeInput)

    return new WorkflowResponse(void 0)
  }
)
