import { Request, Response } from "express"
import { IsBoolean, IsOptional, IsString } from "class-validator"

import SalesChannelService from "../../../../services/sales-channel"
import { CreateSalesChannelInput } from "../../../../types/sales-channels"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /sales-channels
 * operationId: "PostSalesChannels"
 * summary: "Create a sales channel"
 * description: "Creates a sales channel."
 * x-authenticated: true
 * parameters:
 *   - (body) name=* {string} Name of the sales channel
 *   - (body) description=* {string} Description of the sales channel
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
  const validatedBody = req.validatedBody as CreateSalesChannelInput
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const salesChannel = await manager.transaction(async (transactionManager) => {
    return await salesChannelService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  res.status(200).json({ sales_channel: salesChannel })
}

export class AdminPostSalesChannelsReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean
}
