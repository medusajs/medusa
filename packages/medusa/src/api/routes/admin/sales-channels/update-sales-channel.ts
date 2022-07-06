import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { SalesChannelService } from "../../../../services"

/**
 * @oas [post] /sales-channels/{id}
 * operationId: "PostSalesChannelsSalesChannel"
 * summary: "Update a Sales Channel"
 * description: "Updates a Sales Channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Sales Channel.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             type: string
 *             description: Name of the sales channel.
 *           description:
 *             type: string
 *             description:  Sales Channel description.
 *           is_disabled:
 *             type: boolean
 *             description:  Indication of if the sales channel is active.
 * tags:
 *   - Sales Channel
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/sales-channel"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostSalesChannelsSalesChannelReq
  }

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const sales_channel = await salesChannelService.update(id, validatedBody)
  res.status(200).json({ sales_channel })
}

export class AdminPostSalesChannelsSalesChannelReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean
}
