import {
  ISalesChannelModuleService,
  IStoreModuleService,
  MedusaContainer,
  SalesChannelDTO,
} from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  Modules,
  isDefined,
  useCache,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the sales channel to find.
 */
export interface FindSalesChannelStepInput {
  /**
   * The ID of the sales channel to find.
   */
  salesChannelId?: string | null
}

async function fetchSalesChannel(
  salesChannelId: string,
  container: MedusaContainer
) {
  const salesChannelService = container.resolve<ISalesChannelModuleService>(
    Modules.SALES_CHANNEL
  )

  return await useCache<
    Awaited<ReturnType<typeof salesChannelService.retrieveSalesChannel>>
  >(async () => salesChannelService.retrieveSalesChannel(salesChannelId), {
    container,
    key: ["find-sales-channel", salesChannelId],
  })
}

async function fetchStore(container: MedusaContainer) {
  const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)
  return await useCache<Awaited<ReturnType<typeof storeModule.listStores>>>(
    async () =>
      storeModule.listStores(
        {},
        { select: ["id", "default_sales_channel_id"] }
      ),
    { key: "find-sales-channel-default-store", container }
  )
}

export const findSalesChannelStepId = "find-sales-channel"
/**
 * This step either retrieves a sales channel either using the ID provided as an input, or, if no ID
 * is provided, the default sales channel of the first store.
 */
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: FindSalesChannelStepInput, { container }) => {
    let salesChannel: SalesChannelDTO | undefined

    if (data.salesChannelId) {
      salesChannel = await fetchSalesChannel(data.salesChannelId, container)
    } else if (!isDefined(data.salesChannelId)) {
      const [store] = await fetchStore(container)

      if (store?.default_sales_channel_id) {
        salesChannel = await fetchSalesChannel(
          store.default_sales_channel_id,
          container
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
