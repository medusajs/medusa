import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export type SetActiveViewConfigurationStepInput = {
  id: string
  entity: string
  user_id: string
}

export const setActiveViewConfigurationStepId = "set-active-view-configuration"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
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
