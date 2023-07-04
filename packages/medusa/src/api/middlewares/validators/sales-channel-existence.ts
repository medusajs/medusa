import { NextFunction, Request, Response } from "express"
import { SalesChannelService } from "../../../services"
import { ProductSalesChannelReq } from "../../../types/product"

export function validateSalesChannelsExist(
  getSalesChannels: (req) => ProductSalesChannelReq[] | undefined
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const salesChannels = getSalesChannels(req)

    if (!salesChannels?.length) {
      return next()
    }

    const salesChannelService: SalesChannelService = req.scope.resolve(
      "salesChannelService"
    )

    const salesChannelIds = salesChannels.map((salesChannel) => salesChannel.id)
    const [existingChannels] = await salesChannelService.listAndCount({
      id: salesChannelIds,
    })

    const nonExistingSalesChannels = salesChannelIds.filter(
      (scId) => existingChannels.findIndex((sc) => sc.id === scId) === -1
    )

    if (nonExistingSalesChannels.length) {
      req.errors = req.errors ?? []
      req.errors.push(
        `Sales Channels ${nonExistingSalesChannels.join(", ")} do not exist`
      )
    }

    return next()
  }
}
