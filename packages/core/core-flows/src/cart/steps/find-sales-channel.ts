import {
  ISalesChannelModuleService,
  IStoreModuleService,
  SalesChannelDTO,
} from "@medusajs/framework/types"
import { MedusaError, Modules, isDefined } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface FindSalesChannelStepInput {
  salesChannelId?: string | null
}

export const findSalesChannelStepId = "find-sales-channel"
/**
 * This step either retrieves a sales channel either using the ID provided as an input, or, if no ID
 * is provided, the default sales channel of the first store.
 */
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: FindSalesChannelStepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      Modules.SALES_CHANNEL
    )
    const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)

    let salesChannel: SalesChannelDTO | undefined

    if (data.salesChannelId) {
      salesChannel = await salesChannelService.retrieveSalesChannel(
        data.salesChannelId
      )
    } else if (!isDefined(data.salesChannelId)) {
      const [store] = await storeModule.listStores(
        {},
        { select: ["default_sales_channel_id"] }
      )

      if (store?.default_sales_channel_id) {
        salesChannel = await salesChannelService.retrieveSalesChannel(
          store.default_sales_channel_id
        )
      }
    }

    if (!salesChannel) {
      return new StepResponse(null)
    }

    if (salesChannel?.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unable to assign cart to disabled Sales Channel: ${salesChannel.name}`
      )
    }

    return new StepResponse(salesChannel)
  }
)
