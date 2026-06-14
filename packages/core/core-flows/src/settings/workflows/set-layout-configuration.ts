import {
  LayoutConfigurationData,
  LayoutConfigurationDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { setActiveLayoutScopeStep, setLayoutConfigurationStep } from "../steps"

export type SetLayoutConfigurationWorkflowInput = {
  zone: string
  user_id: string
  is_default?: boolean
  configuration: LayoutConfigurationData
}

export const setLayoutConfigurationWorkflowId = "set-layout-configuration"

export const setLayoutConfigurationWorkflow = createWorkflow(
  setLayoutConfigurationWorkflowId,
  (
    input: WorkflowData<SetLayoutConfigurationWorkflowInput>
  ): WorkflowResponse<LayoutConfigurationDTO> => {
    const layoutConfig = setLayoutConfigurationStep(input)

    // Persist the saved scope as the user's active view for the zone, so it
    // sticks across reloads.
    const scopeInput = transform({ input }, ({ input }) => ({
      zone: input.zone,
      user_id: input.user_id,
      scope: (input.is_default ? "default" : "personal") as
        | "personal"
        | "default",
    }))
    setActiveLayoutScopeStep(scopeInput)

    return new WorkflowResponse(layoutConfig)
  }
)
