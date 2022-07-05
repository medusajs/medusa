import { Response } from "express"
import { ExtendedRequest } from "../../../../types/global"
import { SalesChannel } from "../../../../models"

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
  req: ExtendedRequest<SalesChannel>,
  res: Response
): Promise<void> => {
  res.status(200).json({ sales_channel: req.resource })
}
