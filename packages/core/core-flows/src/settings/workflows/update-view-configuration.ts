import {
  UpdateViewConfigurationDTO,
  ViewConfigurationDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  when,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  updateViewConfigurationStep,
  setActiveViewConfigurationStep,
} from "../steps"

/**
 * The data to update a view configuration, along with whether to set it as the
 * user's active view for the entity.
 */
export type UpdateViewConfigurationWorkflowInput = {
  /**
   * The ID of the view configuration to update.
   */
  id: string
  /**
   * Whether to set the configuration as the user's active view for the entity.
   * Only applies when the configuration belongs to a user.
   */
  set_active?: boolean
} & UpdateViewConfigurationDTO

export const updateViewConfigurationWorkflowId = "update-view-configuration"

/**
 * This workflow updates a view configuration's details, such as its name or column
 * configuration. If `set_active` is enabled and the configuration belongs to a
 * user, the configuration is also set as that user's active view for the entity.
 *
 * This workflow is used by the [Update View Configuration](https://docs.medusajs.com/api/admin/views/update-view-configuration)
 * API route.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to update a view configuration within your custom flows.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * const { result } = await updateViewConfigurationWorkflow(container)
 *   .run({
 *     input: {
 *       id: "viewconfig_123",
 *       set_active: true,
 *       configuration: {
 *         visible_columns: ["display_id", "status"],
 *       },
 *     },
 *   })
 *
 * @summary
 *
 * Update a view configuration.
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
