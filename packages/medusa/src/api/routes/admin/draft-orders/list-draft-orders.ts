import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { DraftOrderStatus } from "../../../../models"
import { DraftOrderService } from "../../../../services"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { DraftOrderStatusValue } from "../../../../types/draft-orders"

/**
 * @oas [get] /admin/draft-orders
 * operationId: "GetDraftOrders"
 * summary: "List Draft Orders"
 * description: "Retrieve an list of Draft Orders. The draft orders can be filtered by fields such as `q`. The draft orders can also paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {number} The number of draft orders to skip when retrieving the draft orders.
 *   - (query) limit=50 {number} Limit the number of draft orders returned.
 *   - (query) q {string} a term to search draft orders' display IDs and emails in the draft order's cart
 *   - (query) order {string} Field to sort retrieved draft orders by.
 *   - (query) expand {string} A comma-separated list of fields to expand.
 *   - (query) fields {string} A comma-separated list of fields to include in the response.
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
 *     name: status
 *     style: form
 *     explode: false
 *     description: Filter by status
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [open, completed]
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetDraftOrdersParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.list()
 *       .then(({ draft_orders, limit, offset, count }) => {
 *         console.log(draft_orders.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminDraftOrders } from "medusa-react"
 *
 *       const DraftOrders = () => {
 *         const { draft_orders, isLoading } = useAdminDraftOrders()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {draft_orders && !draft_orders.length && (
 *               <span>No Draft Orders</span>
 *             )}
 *             {draft_orders && draft_orders.length > 0 && (
 *               <ul>
 *                 {draft_orders.map((order) => (
 *                   <li key={order.id}>{order.display_id}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default DraftOrders
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/draft-orders' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Draft Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDraftOrdersListRes"
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

export default async (req, res) => {
  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")

  const { skip, take } = req.listConfig

  const [draftOrders, count] = await draftOrderService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  res.json({
    draft_orders: draftOrders,
    count,
    offset: skip,
    limit: take,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved draft orders.
 */
export class AdminGetDraftOrdersParams extends extendedFindParamsMixin({
  limit: 50,
}) {
  /**
   * Search term to search draft orders by their display IDs and emails.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsOptional()
  @IsString()
  expand?: string

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsOptional()
  @IsNumber()
  fields?: string

  /**
   * Statuses to filter draft orders by.
   */
  @IsArray()
  @IsEnum(DraftOrderStatus, { each: true })
  @IsOptional()
  status?: DraftOrderStatusValue[]

  /**
   * Date filters to apply on the draft orders' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the draft orders' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
