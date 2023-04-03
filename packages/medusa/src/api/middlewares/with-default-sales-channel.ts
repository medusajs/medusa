import { NextFunction, Request, Response } from "express"
import { SalesChannelService } from "../../services"

/**
 * Middleware that includes the default sales channel on the request, if no sales channels present
 * @param asArray Whether to include the default sales channel id as an array or just a string
 */
export function withDefaultSalesChannel(
  asArray?: boolean
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _, next: NextFunction) => {
    if (req.query.sales_channel_id?.length) {
      return next()
    }

    const salesChannelService: SalesChannelService = req.scope.resolve(
      "salesChannelService"
    )

    const defaultSalesChannel = await salesChannelService.retrieveDefault()
    req.query.sales_channel_id = asArray
      ? [defaultSalesChannel.id]
      : defaultSalesChannel.id

    next()
  }
}
