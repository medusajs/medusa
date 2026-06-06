import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import { MedusaError, Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to validate if sales channels can be deleted.
 */
export type CanDeleteSalesChannelsOrThrowStepInput = {
  /**
   * The IDs of the sales channels to validate.
   */
  ids: string | string[]
}

export const canDeleteSalesChannelsOrThrowStepId =
  "can-delete-sales-channels-or-throw-step"

/**
 * This step validates that the specified sales channels can be deleted.
 * If any of the sales channels are default sales channels for a store, 
 * the step will throw an error.
 * 
 * @example
 * const data = canDeleteSalesChannelsOrThrowStep({
 *   ids: ["sc_123"]
 * })
 */
export const canDeleteSalesChannelsOrThrowStep = createStep(
  canDeleteSalesChannelsOrThrowStepId,
  async ({ ids }: CanDeleteSalesChannelsOrThrowStepInput, { container }) => {
    const salesChannelIdsToDelete = Array.isArray(ids) ? ids : [ids]

    const storeModule = await container.resolve(Modules.STORE)

    const stores = await storeModule.listStores(
      {
        default_sales_channel_id: salesChannelIdsToDelete,
      },
      {
        select: ["default_sales_channel_id"],
      }
    )

    const defaultSalesChannelIds = stores.map((s) => s.default_sales_channel_id)

    if (defaultSalesChannelIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot delete default sales channels: ${defaultSalesChannelIds.join(
          ", "
        )}`
      )
    }

    return new StepResponse(true)
  }
)
