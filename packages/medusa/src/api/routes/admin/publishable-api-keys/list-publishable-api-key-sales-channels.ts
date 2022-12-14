import { Request, Response } from "express"

import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [get] /publishable-api-keys/{id}/sales-channels
 * operationId: "GetPublishableApiKeySalesChannels"
 * summary: "List PublishableApiKey's SalesChannels"
 * description: "List PublishableApiKey's SalesChannels"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Publishable Api Key.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.listSalesChannels()
 *         .then(({ sales_channels, limit, offset, count }) => {
 *           console.log(sales_channels)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/publishable-api-keys/pk_123/sales-channels' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - PublishableApiKey
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *          properties:
 *             sales_channels:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/sales_channel"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const publishableApiKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  const salesChannels = await publishableApiKeyService.listSalesChannels(id)

  return res.json({
    sales_channels: salesChannels,
  })
}

export class GetPublishableApiKeySalesChannelsParams {}
