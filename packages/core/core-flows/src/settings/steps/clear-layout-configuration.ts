import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input to clear the layout configuration.
 */
export type ClearLayoutConfigurationStepInput = {
  /**
   * The zone that the layout configuration applies to.
   */
  zone: string
  /**
   * The ID of the user whose layout configuration is cleared.
   */
  user_id: string
}

export const clearLayoutConfigurationStepId = "clear-layout-configuration"
/**
 * This step clears a user's personal layout configuration for a zone,
 * reverting them to the system default.
 *
 * @since 2.17.2
 *
 * @example
 * const data = clearLayoutConfigurationStep({
 *   zone: "products",
 *   user_id: "user_123",
 * })
 */
export const clearLayoutConfigurationStep = createStep(
  clearLayoutConfigurationStepId,
  async (input: ClearLayoutConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const [previous] = await service.listLayoutConfigurations(
      { zone: input.zone, user_id: input.user_id },
      { take: 1 }
    )

    await service.clearLayoutConfiguration(input.zone, input.user_id)

    return new StepResponse(void 0, {
      zone: input.zone,
      user_id: input.user_id,
      previousConfiguration: previous?.configuration ?? null,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput?.previousConfiguration) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    await service.setLayoutConfiguration(
      compensateInput.zone,
      compensateInput.user_id,
      compensateInput.previousConfiguration
    )
  }
)
