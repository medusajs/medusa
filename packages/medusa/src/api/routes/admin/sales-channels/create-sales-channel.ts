import { Request, Response } from "express"
import { IsObject, IsOptional, IsString } from "class-validator"

import { validator } from "../../../../utils/validator"
import SalesChannelService from "../../../../services/sales-channel"

/**
 * @oas [post] /sales-channels
 * operationId: "PostSalesChannel"
 * summary: "Create a SalesChannel"
 * description: "Creates a SalesChannel."
 * x-authenticated: true
 * parameters:
 *   - (body) name=* {string} Name of the sales channel
 *   - (body) description=* {string} Description of the sales channel
 *   - (body) metadata {object} Metadata for the channel.
 * tags:
 *   - SalesChannels
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             sales_channel:
 *               $ref: "#/components/schemas/sales_channel"
 */

export default async (req: Request, res: Response) => {
  const validated = await validator(AdminPostSalesChannelReq, req.body)

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const salesChannel = await salesChannelService.create(validated)
  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminPostSalesChannelReq {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
