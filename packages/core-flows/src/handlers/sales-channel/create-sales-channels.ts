import { createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateSalesChannelDTO,
  ISalesChannelModuleService,
  SalesChannelDTO,
} from "@medusajs/types"

export const createSalesChannelsStep = createStep<
  CreateSalesChannelDTO[],
  SalesChannelDTO[],
  void
>(
  "create-sales-channels",
  async (data: CreateSalesChannelDTO[], { container }) => {
    const salesChannelService: ISalesChannelModuleService = container.resolve(
      ModuleRegistrationName.SALES_CHANNEL
    )

    return await salesChannelService!.create(data)
  }
)
