import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for setting a view configuration as the active view.
 */
export type SetActiveViewConfigurationStepInput = {
  /**
   * The ID of the view configuration to set as active.
   */
  id: string
  /**
   * The entity the view configuration is for.
   */
  entity: string
  /**
   * The ID of the user to set the active view configuration for.
   */
  user_id: string
}

export const setActiveViewConfigurationStepId = "set-active-view-configuration"

/**
 * This step sets a view configuration as the active view for a user and entity.
 * It compensates by restoring the user's previously active view, or clearing it
 * if there wasn't one.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * setActiveViewConfigurationStep({
 *   id: "viewconfig_123",
 *   entity: "orders",
 *   user_id: "user_123",
 * })
 */
export const setActiveViewConfigurationStep = createStep(
  setActiveViewConfigurationStepId,
  async (input: SetActiveViewConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    // Get the currently active view configuration for rollback
    const currentActiveView = await service.getActiveViewConfiguration(
      input.entity,
      input.user_id
    )

    // Set the new view as active
    await service.setActiveViewConfiguration(
      input.entity,
      input.user_id,
      input.id
    )

    return new StepResponse(input.id, {
      entity: input.entity,
      user_id: input.user_id,
      previousActiveViewId: currentActiveView?.id || null,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    if (compensateInput.previousActiveViewId) {
      // Restore the previous active view
      await service.setActiveViewConfiguration(
        compensateInput.entity,
        compensateInput.user_id,
        compensateInput.previousActiveViewId
      )
    } else {
      // If there was no previous active view, clear the active view
      await service.clearActiveViewConfiguration(
        compensateInput.entity,
        compensateInput.user_id
      )
    }
  }
)
