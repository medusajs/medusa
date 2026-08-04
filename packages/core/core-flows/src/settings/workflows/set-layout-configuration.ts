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

/**
 * The data to set a layout configuration.
 */
export type SetLayoutConfigurationWorkflowInput = {
  /**
   * The zone that the layout configuration applies to.
   */
  zone: string
  /**
   * The ID of the user that the layout configuration belongs to.
   */
  user_id: string
  /**
   * Whether to set the configuration as the system default for the zone,
   * rather than the user's personal configuration.
   */
  is_default?: boolean
  /**
   * The layout configuration data to set.
   */
  configuration: LayoutConfigurationData
}

export const setLayoutConfigurationWorkflowId = "set-layout-configuration"
/**
 * This workflow sets a layout configuration for a zone, either as the user's
 * personal configuration or as the system default. It also persists the saved
 * scope as the user's active view for the zone, so it sticks across reloads.
 *
 * This workflow is used by the
 * [Set Layout Configuration Admin API Route](https://docs.medusajs.com/api/admin/layouts/add-layout-configuration).
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to set a layout configuration within your custom flows.
 *
 * @since 2.17.2
 *
 * @example
 * const { result } = await setLayoutConfigurationWorkflow(container)
 *   .run({
 *     input: {
 *       zone: "products",
 *       user_id: "user_123",
 *       configuration: {
 *         // ...
 *       },
 *     },
 *   })
 *
 * @summary
 *
 * Set a layout configuration for a zone.
 */
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
