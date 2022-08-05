import { Request, Response } from "express"

import { SalesChannelService } from "../../../../services"

/**
 * @oas [get] /sales-channels/{id}
 * operationId: "GetSalesChannelsSalesChannel"
 * summary: "Retrieve a sales channel"
 * description: "Retrieves the sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales channel.
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
export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const salesChannel = await salesChannelService.retrieve(id)
  res.status(200).json({ sales_channel: salesChannel })
}
