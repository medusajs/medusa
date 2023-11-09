import { Request, Response } from "express"
import { IsOptional, IsString } from "class-validator"

import PublishableApiKeyService from "../../../../services/publishable-api-key"
import { extendedFindParamsMixin } from "../../../../types/common"

/**
 * @oas [get] /admin/publishable-api-keys/{id}/sales-channels
 * operationId: "GetPublishableApiKeySalesChannels"
 * summary: "List Sales Channels"
 * description: "List the sales channels associated with a publishable API key. The sales channels can be filtered by fields such as `q`."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the publishable API key.
 *   - (query) q {string} query to search sales channels' names and descriptions.
 * x-codegen:
 *   method: listSalesChannels
 *   queryParams: GetPublishableApiKeySalesChannelsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.listSalesChannels()
 *       .then(({ sales_channels }) => {
 *         console.log(sales_channels.length)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/publishable-api-keys/{id}/sales-channels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Publishable Api Keys
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPublishableApiKeysListSalesChannelsRes"
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

  const filterableFields = req.filterableFields

  const salesChannels = await publishableApiKeyService.listSalesChannels(id, {
    q: filterableFields.q as string | undefined,
  })

  return res.json({
    sales_channels: salesChannels,
  })
}

/**
 * Parameters used to filter the sales channels.
 */
export class GetPublishableApiKeySalesChannelsParams extends extendedFindParamsMixin() {
  /**
   * Search term to search sales channels' names and descriptions.
   */
  @IsOptional()
  @IsString()
  q?: string
}
