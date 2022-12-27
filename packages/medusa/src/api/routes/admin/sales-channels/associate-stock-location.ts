import { IsString } from "class-validator"
import { Request, Response } from "express"

import {
  SalesChannelService,
  SalesChannelLocationService,
} from "../../../../services"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostSalesChannelsChannelStockLocationsReq
  }

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )
  await channelLocationService.associateLocation(id, validatedBody.location_id)

  const channel = await salesChannelService.retrieve(id)

  res.status(200).json({ sales_channel: channel })
}

export class AdminPostSalesChannelsChannelStockLocationsReq {
  @IsString()
  location_id: string
}
