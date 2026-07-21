import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for setting the active layout scope for a user in a zone.
 */
export type SetActiveLayoutScopeStepInput = {
  /**
   * The zone that the layout scope applies to.
   */
  zone: string
  /**
   * The ID of the user whose active layout scope is set.
   */
  user_id: string
  /**
   * The active layout scope to set for the user. If not provided, the
   * user's active scope is cleared.
   */
  scope?: "personal" | "default"
}

export const setActiveLayoutScopeStepId = "set-active-layout-scope"
/**
 * This step sets a user's active layout scope for a zone, which determines
 * whether the user's personal or the system default configuration is shown.
 *
 * @since 2.17.2
 *
 * @example
 * const data = setActiveLayoutScopeStep({
 *   zone: "products",
 *   user_id: "user_123",
 *   scope: "personal",
 * })
 */
export const setActiveLayoutScopeStep = createStep(
  setActiveLayoutScopeStepId,
  async (input: SetActiveLayoutScopeStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const previousScope = await service.getActiveLayoutScope(
      input.zone,
      input.user_id
    )

    await service.setActiveLayoutScope(input.zone, input.user_id, input.scope ?? null)

    return new StepResponse(input.scope, {
      zone: input.zone,
      user_id: input.user_id,
      previousScope,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    await service.setActiveLayoutScope(
      compensateInput.zone,
      compensateInput.user_id,
      compensateInput.previousScope
    )
  }
)
