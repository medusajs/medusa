import { Response } from "express"
import { SalesChannelRequest } from "../../../../types/sales-channels"

export default async (
  req: SalesChannelRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({ sales_channel: req.sales_channel })
}
