import { IsNumber, IsOptional, IsString } from "class-validator"

import { FilterablePriceListProps } from "../../../../types/price-list"
import PriceListService from "../../../../services/price-list"
import { Request } from "express"
import { Type } from "class-transformer"

/**
 * @oas [get] /price-lists
 * operationId: "GetPriceLists"
 * summary: "List Price Lists"
 * description: "Retrieves a list of Price Lists."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {number} The number of items to get
 *   - (query) offset=0 {number} The offset at which to get items
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each item of the result.
 *   - (query) order {string} field to order results by.
 *   - (query) id {string} ID to search for.
 *   - (query) q {string} query to search in price list description, price list name, and customer group name fields.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Status to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [active, draft]
 *   - (query) name {string} price list name to search for.
 *   - in: query
 *     name: customer_groups
 *     style: form
 *     explode: false
 *     description: Customer Group IDs to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: type
 *     style: form
 *     explode: false
 *     description: Type to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [sale, override]
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting price lists were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting price lists were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Date comparison for when resulting price lists were deleted.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetPriceListPaginationParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.list()
 *       .then(({ price_lists, limit, offset, count }) => {
 *         console.log(price_lists.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/price-lists' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListsListRes"
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
export default async (req: Request, res) => {
  const validated = req.validatedQuery

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const [price_lists, count] = await priceListService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  res.json({
    price_lists,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

// eslint-disable-next-line max-len
export class AdminGetPriceListPaginationParams extends FilterablePriceListProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  order?: string
}
