import type { AuthTypes, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createAuthIdentitiesStepId = "create-auth-identities"

/**
 * This step creates one or more auth identities.
 */
export const createAuthIdentitiesStep = createStep(
  createAuthIdentitiesStepId,
  async (
    data: AuthTypes.CreateAuthIdentityDTO[],
    { container }
  ) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const created = await service.createAuthIdentities(data)

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    await service.deleteAuthIdentities(ids)
  }
)
