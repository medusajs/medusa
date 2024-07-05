import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request } from "express"
import PriceListService from "../../../../services/price-list"
import { FilterablePriceListProps } from "../../../../types/price-list"

/**
 * @oas [get] /admin/price-lists
 * operationId: "GetPriceLists"
 * summary: "List Price Lists"
 * description: "Retrieve a list of price lists. The price lists can be filtered by fields such as `q` or `status`. The price lists can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {number} Limit the number of price lists returned.
 *   - (query) offset=0 {number} The number of price lists to skip when retrieving the price lists.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned price lists.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned price lists.
 *   - (query) order {string} A price-list field to sort-order the retrieved price lists by.
 *   - (query) id {string} Filter by ID
 *   - (query) q {string} term to search price lists' description, name, and customer group's name.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Filter by status.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [active, draft]
 *   - (query) name {string} Filter by name
 *   - in: query
 *     name: customer_groups
 *     style: form
 *     explode: false
 *     description: Filter by customer-group IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: type
 *     style: form
 *     explode: false
 *     description: Filter by type.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [sale, override]
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
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
 *     description: Filter by an update date range.
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
 *     description: Filter by a deletion date range.
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminPriceLists } from "medusa-react"
 *
 *       const PriceLists = () => {
 *         const { price_lists, isLoading } = useAdminPriceLists()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {price_lists && !price_lists.length && (
 *               <span>No Price Lists</span>
 *             )}
 *             {price_lists && price_lists.length > 0 && (
 *               <ul>
 *                 {price_lists.map((price_list) => (
 *                   <li key={price_list.id}>{price_list.name}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default PriceLists
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/price-lists' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Price Lists
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

  const [priceLists, count] = await priceListService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  res.json({
    price_lists: priceLists,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved price lists.
 */
// eslint-disable-next-line max-len
export class AdminGetPriceListPaginationParams extends FilterablePriceListProps {
  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string
}
