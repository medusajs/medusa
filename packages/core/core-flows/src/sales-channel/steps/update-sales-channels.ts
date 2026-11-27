import {
  FilterableSalesChannelProps,
  ISalesChannelModuleService,
  UpdateSalesChannelDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  removeUndefined,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update sales channels.
 */
export type UpdateSalesChannelsStepInput = {
  /**
   * The filters to select the sales channels to update.
   */
  selector: FilterableSalesChannelProps
  /**
   * The data to update the sales channels.
   */
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsStepId = "update-sales-channels"
/**
 * This step updates sales channels matching the specified filters.
 * 
 * @example
 * const data = updateSalesChannelsStep({
 *   selector: {
 *     id: "sc_123"
 *   },
 *   update: {
 *     name: "Webshop"
 *   }
 * })
 */
export const updateSalesChannelsStep = createStep(
  updateSalesChannelsStepId,
  async (data: UpdateSalesChannelsStepInput, { container }) => {
    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data.update],
      {
        objectFields: ["metadata"],
        requiredFields: [
          "id",
          "name",
          "description",
          "is_disabled",
          "metadata",
        ],
      }
    )

    const prevData = await service.listSalesChannels(data.selector, {
      select: selects,
      relations,
    })

    const channels = await service.updateSalesChannels(
      data.selector,
      data.update
    )

    return new StepResponse(channels, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )

    await service.upsertSalesChannels(
      prevData.map((r) =>
        removeUndefined({
          id: r.id,
          name: r.name,
          description: r.description,
          is_disabled: r.is_disabled,
          metadata: r.metadata,
        })
      )
    )
  }
)
