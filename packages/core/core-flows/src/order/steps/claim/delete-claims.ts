import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of deleting one or more claims.
 */
export type DeleteOrderClaimsInput = {
  /**
   * The IDs of the claims to delete.
   */
  ids: string[]
}

export const deleteClaimsStepId = "delete-claims"
/**
 * This step deletes one or more order claims.
 */
export const deleteClaimsStep = createStep(
  deleteClaimsStepId,
  async (data: DeleteOrderClaimsInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const deleted = await service.softDeleteOrderClaims(data.ids)

    return new StepResponse(deleted, data.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderClaims(ids)
  }
)
