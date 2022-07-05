import SalesChannelService from "../../../services/sales-channel"
import { NextFunction, Request, Response } from "express"
import { SalesChannelRequest } from "../../../types/sales-channels"

export async function getRequestedSalesChannel(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = req.params.id
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  try {
    ;(req as SalesChannelRequest).sales_channel =
      await salesChannelService.retrieve(id)
  } catch (error) {
    return next(error)
  }

  next()
}
