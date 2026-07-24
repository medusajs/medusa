import {
  CreateViewConfigurationDTO,
  ViewConfigurationDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  when,
} from "@medusajs/framework/workflows-sdk"
import {
  createViewConfigurationStep,
  setActiveViewConfigurationStep,
} from "../steps"

/**
 * The data to create a view configuration, along with whether to set it as the
 * user's active view for the entity.
 */
export type CreateViewConfigurationWorkflowInput =
  CreateViewConfigurationDTO & {
    /**
     * Whether to set the created configuration as the user's active view for the
     * entity. Only applies when a `user_id` is provided.
     */
    set_active?: boolean
  }

export const createViewConfigurationWorkflowId = "create-view-configuration"

/**
 * This workflow creates a view configuration, which stores the column visibility,
 * ordering, filters, and sorting preferences for an entity's data table in the
 * admin dashboard. If `set_active` is enabled and a `user_id` is provided, the
 * created configuration is also set as the user's active view for the entity.
 *
 * This workflow is used by the [Create View Configuration](https://docs.medusajs.com/api/admin/views/create-view-configuration)
 * API route.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to create a view configuration within your custom flows.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * const { result } = await createViewConfigurationWorkflow(container)
 *   .run({
 *     input: {
 *       entity: "orders",
 *       name: "My Orders View",
 *       user_id: "user_123",
 *       set_active: true,
 *       configuration: {
 *         visible_columns: ["display_id", "status", "total"],
 *         column_order: ["display_id", "status", "total"],
 *       },
 *     },
 *   })
 *
 * @summary
 *
 * Create a view configuration.
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
