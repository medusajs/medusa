import { Response } from "express"
import { SalesChannelRequest } from "../../../../types/sales-channels"

/**
 * @oas [get] /sales-channels/{id}
 * operationId: "GetSalesChannelsSalesChannel"
 * summary: "Retrieve a sales channel"
 * description: "Retrieves the sales channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Sales channel.
 * tags:
 *   - Sales channel
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             sales_channel:
 *               $ref: "#/components/schemas/sales-channel"
 */
export default async (
  req: SalesChannelRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({ sales_channel: req.sales_channel })
}
