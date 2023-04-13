import { NextFunction, Request, Response } from "express"
import { SalesChannelService } from "../../services"

/**
 * Middleware that includes the default sales channel on the request, if no sales channels present
 * @param context Object of options
 * @param context.attachChannelAsArray Whether to attach the default sales channel as an array or just a string
 */
export function withDefaultSalesChannel({
  attachChannelAsArray,
}: {
  attachChannelAsArray?: boolean
}): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _, next: NextFunction) => {
    if (
      req.query.sales_channel_id?.length ||
      req.get("x-publishable-api-key")
    ) {
      return next()
    }

    const salesChannelService: SalesChannelService = req.scope.resolve(
      "salesChannelService"
    )

    const defaultSalesChannel = await salesChannelService.retrieveDefault()
    if (defaultSalesChannel?.id) {
      req.query.sales_channel_id = attachChannelAsArray
        ? [defaultSalesChannel.id]
        : defaultSalesChannel.id
    }
    next()
  }
}
