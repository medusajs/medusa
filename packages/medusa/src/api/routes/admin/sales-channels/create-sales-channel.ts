import { IsObject, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CreateSalesChannelInput } from "../../../../types/sales-channels"
import SalesChannelService from "../../../../services/sales-channel"

/**
 * @oas [post] /sales-channels
 * operationId: "PostSalesChannels"
 * summary: "Create a sales channel"
 * description: "Creates a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (body) name=* {string} Name of the sales channel
 *   - (body) description=* {string} Description of the sales channel
 *   - (body) is_disabled {boolean} Whether the sales channel is enabled or not
 * tags:
 *   - Sales Channel
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
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const salesChannel = await salesChannelService.create(
    req.validatedBody as CreateSalesChannelInput
  )
  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminPostSalesChannelsReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string
}
