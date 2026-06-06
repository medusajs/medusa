import {
  CreateViewConfigurationDTO,
  ViewConfigurationDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  when,
} from "@zjedene-medusa/framework/workflows-sdk"
import {
  createViewConfigurationStep,
  setActiveViewConfigurationStep,
} from "../steps"

export type CreateViewConfigurationWorkflowInput =
  CreateViewConfigurationDTO & {
    set_active?: boolean
  }

export const createViewConfigurationWorkflowId = "create-view-configuration"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const createViewConfigurationWorkflow = createWorkflow(
  createViewConfigurationWorkflowId,
  (
    input: WorkflowData<CreateViewConfigurationWorkflowInput>
  ): WorkflowResponse<ViewConfigurationDTO> => {
    const viewConfig = createViewConfigurationStep(input)

    when({ input, viewConfig }, ({ input }) => {
      return !!input.set_active && !!input.user_id
    }).then(() => {
      setActiveViewConfigurationStep({
        id: viewConfig.id,
        entity: viewConfig.entity,
        user_id: input.user_id as string,
      })
    })

    return new WorkflowResponse(viewConfig)
  }
)
