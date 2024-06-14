import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ISalesChannelModuleService,
  IStoreModuleService,
  SalesChannelDTO,
} from "@medusajs/types"
import { MedusaError, isDefined } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  salesChannelId?: string | null
}

export const findSalesChannelStepId = "find-sales-channel"
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: StepInput, { container }) => {
    const salesChannelService = container.resolve<ISalesChannelModuleService>(
      ModuleRegistrationName.SALES_CHANNEL
    )
    const storeModule = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    let salesChannel: SalesChannelDTO | undefined

    if (data.salesChannelId) {
      salesChannel = await salesChannelService.retrieveSalesChannel(data.salesChannelId)
    } else if (!isDefined(data.salesChannelId)) {
      const [store] = await storeModule.list(
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
