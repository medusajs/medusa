import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { clearLayoutConfigurationStep, setActiveLayoutScopeStep } from "../steps"

/**
 * The data to clear a layout configuration.
 */
export type ClearLayoutConfigurationWorkflowInput = {
  /**
   * The zone that the layout configuration applies to.
   */
  zone: string
  /**
   * The ID of the user whose layout configuration is cleared.
   */
  user_id: string
}

export const clearLayoutConfigurationWorkflowId = "clear-layout-configuration"
/**
 * This workflow clears a user's personal layout configuration for a zone,
 * reverting them to the system default. It also resets the user's active
 * layout scope for the zone.
 *
 * This workflow is used by the
 * [Clear Layout Configuration Admin API Route](https://docs.medusajs.com/api/admin/layouts/clear-configuration-of-layout).
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to clear a layout configuration within your custom flows.
 *
 * @since 2.17.2
 *
 * @example
 * const { result } = await clearLayoutConfigurationWorkflow(container)
 *   .run({
 *     input: {
 *       zone: "products",
 *       user_id: "user_123",
 *     },
 *   })
 *
 * @summary
 *
 * Clear a user's layout configuration for a zone.
 */
export const clearLayoutConfigurationWorkflow = createWorkflow(
  clearLayoutConfigurationWorkflowId,
  (input: WorkflowData<ClearLayoutConfigurationWorkflowInput>) => {
    clearLayoutConfigurationStep(input)

    setActiveLayoutScopeStep(input)

    return new WorkflowResponse(void 0)
  }
)
