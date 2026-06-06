import {
  UpdateViewConfigurationDTO,
  ViewConfigurationDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  when,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import {
  updateViewConfigurationStep,
  setActiveViewConfigurationStep,
} from "../steps"

export type UpdateViewConfigurationWorkflowInput = {
  id: string
  set_active?: boolean
} & UpdateViewConfigurationDTO

export const updateViewConfigurationWorkflowId = "update-view-configuration"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const updateViewConfigurationWorkflow = createWorkflow(
  updateViewConfigurationWorkflowId,
  (
    input: WorkflowData<UpdateViewConfigurationWorkflowInput>
  ): WorkflowResponse<ViewConfigurationDTO> => {
    const updateData = transform({ input }, ({ input }) => {
      const { id, set_active, ...data } = input
      return data
    })

    const viewConfig = updateViewConfigurationStep({
      id: input.id,
      data: updateData,
    })

    when({ input, viewConfig }, ({ input, viewConfig }) => {
      return !!input.set_active && !!viewConfig.user_id
    }).then(() => {
      setActiveViewConfigurationStep({
        id: viewConfig.id,
        entity: viewConfig.entity,
        user_id: viewConfig.user_id as string,
      })
    })

    return new WorkflowResponse(viewConfig)
  }
)
