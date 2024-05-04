import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import PublishableApiKeyService from "../../../../services/publishable-api-key"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"

/**
 * @oas [get] /admin/publishable-api-keys
 * operationId: "GetPublishableApiKeys"
 * summary: "List Publishable API keys"
 * description: "Retrieve a list of publishable API keys. The publishable API keys can be filtered by fields such as `q`. The publishable API keys can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search publishable API keys' titles.
 *   - (query) limit=20 {number} Limit the number of publishable API keys returned.
 *   - (query) offset=0 {number} The number of publishable API keys to skip when retrieving the publishable API keys.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned publishable API keys.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned publishable API keys.
 *   - (query) order {string} A field to sort-order the retrieved publishable API keys by.
 *   - in: query
 *     name: created_at
 *     required: false
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *           type: string
 *           description: filter by dates less than this date
 *           format: date
 *         gt:
 *           type: string
 *           description: filter by dates greater than this date
 *           format: date
 *         lte:
 *           type: string
 *           description: filter by dates less than or equal to this date
 *           format: date
 *         gte:
 *           type: string
 *           description: filter by dates greater than or equal to this date
 *           format: date
 *   - in: query
 *     name: updated_at
 *     required: false
 *     description: Filter by a update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *           type: string
 *           description: filter by dates less than this date
 *           format: date
 *         gt:
 *           type: string
 *           description: filter by dates greater than this date
 *           format: date
 *         lte:
 *           type: string
 *           description: filter by dates less than or equal to this date
 *           format: date
 *         gte:
 *           type: string
 *           description: filter by dates greater than or equal to this date
 *           format: date
 *   - in: query
 *     name: revoked_at
 *     required: false
 *     description: Filter by a revocation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *           type: string
 *           description: filter by dates less than this date
 *           format: date
 *         gt:
 *           type: string
 *           description: filter by dates greater than this date
 *           format: date
 *         lte:
 *           type: string
 *           description: filter by dates less than or equal to this date
 *           format: date
 *         gte:
 *           type: string
 *           description: filter by dates greater than or equal to this date
 *           format: date
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
 *       .then(({ publishable_api_keys, count, limit, offset }) => {
 *         console.log(publishable_api_keys)
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { PublishableApiKey } from "@medusajs/medusa"
 *       import { useAdminPublishableApiKeys } from "medusa-react"
 *
 *       const PublishableApiKeys = () => {
 *         const { publishable_api_keys, isLoading } =
 *           useAdminPublishableApiKeys()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {publishable_api_keys && !publishable_api_keys.length && (
 *               <span>No Publishable API Keys</span>
 *             )}
 *             {publishable_api_keys &&
 *               publishable_api_keys.length > 0 && (
 *               <ul>
 *                 {publishable_api_keys.map(
 *                   (publishableApiKey: PublishableApiKey) => (
 *                     <li key={publishableApiKey.id}>
 *                       {publishableApiKey.title}
 *                     </li>
 *                   )
 *                 )}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default PublishableApiKeys
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/publishable-api-keys' \
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

/**
 * Parameters used to filter and configure the pagination of the retrieved publishable API keys.
 */
export class GetPublishableApiKeysParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * Search term to search publishable API keys' titles.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * A field to sort-order the retrieved publishable API keys by.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Date filters to apply on the publishable API keys' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the publishable API keys' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the publishable API keys' `revoked_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  revoked_at?: DateComparisonOperator
}
