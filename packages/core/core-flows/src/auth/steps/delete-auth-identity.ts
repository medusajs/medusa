import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { IAuthModuleService } from "@medusajs/framework/types"

export const deleteAuthIdentityStepId = "delete-auth-identity"

/**
 * The input for the {@link deleteAuthIdentityStep}.
 *
 * @since 2.19.0
 */
export type DeleteAuthIdentityStepInput = {
  /**
   * The ID or IDs of the auth identities to delete.
   */
  id: string | string[]
}

/**
 * This step deletes one or more auth identities.
 *
 * @since 2.19.0
 *
 * @example
 * To delete a single auth identity:
 * ```ts
 * deleteAuthIdentityStep({
 *   id: "authid_1234",
 * })
 * ```
 *
 * To delete multiple auth identities:
 * ```ts
 * deleteAuthIdentityStep({
 *   id: ["authid_1234", "authid_1235"],
 * })
 * ```
 */
export const deleteAuthIdentityStep = createStep(
  deleteAuthIdentityStepId,
  async (input: DeleteAuthIdentityStepInput, { container }) => {
    const authModuleService = container.resolve<IAuthModuleService>(
      Modules.AUTH
    )

    const normalizedInput = Array.isArray(input.id) ? input.id : [input.id]

    const prev = await authModuleService.listAuthIdentities(
      { id: normalizedInput },
      { relations: ["provider_identities"] }
    )

    await authModuleService.deleteAuthIdentities(normalizedInput)

    return new StepResponse(void 0, prev)
  },
  async (prev, { container }) => {
    const authModuleService = container.resolve<IAuthModuleService>(
      Modules.AUTH
    )

    if (!prev) {
      return
    }

    await authModuleService.createAuthIdentities(prev)
  }
)
