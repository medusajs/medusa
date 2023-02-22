import { Request, Response } from "express"
import { IsOptional, IsString } from "class-validator"

import { extendedFindParamsMixin } from "../../../../types/common"
import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [get] /admin/publishable-api-keys
 * operationId: "GetPublishableApiKeys"
 * summary: "List PublishableApiKeys"
 * description: "List PublishableApiKeys."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching publishable api keys by title.
 *   - (query) limit=20 {number} The number of items in the response
 *   - (query) offset=0 {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codegen:
 *   method: list
 *   queryParams: GetPublishableApiKeysParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKeys.list()
 *         .then(({ publishable_api_keys, count, limit, offset }) => {
 *           console.log(publishable_api_keys)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/publishable-api-keys' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Publishable Api Keys
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPublishableApiKeysListRes"
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
  const publishableApiKeyService: PublishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [pubKeys, count] = await publishableApiKeyService.listAndCount(
    filterableFields,
    listConfig
  )

  return res.json({
    publishable_api_keys: pubKeys,
    count,
    limit: take,
    offset: skip,
  })
}

export class GetPublishableApiKeysParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  q?: string
}
