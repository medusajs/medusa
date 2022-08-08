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
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.salesChannels.retrieve(sales_channel_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/sales-channels/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
