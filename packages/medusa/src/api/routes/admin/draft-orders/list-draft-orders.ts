import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."

import { DraftOrder } from "../../../../models"
import { DraftOrderListSelector } from "../../../../types/draft-orders"
import { DraftOrderService } from "../../../../services"
import { FindConfig } from "../../../../types/common"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

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

  const validated = await validator(AdminGetDraftOrdersParams, req.query)

  const selector: DraftOrderListSelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  const listConfig: FindConfig<DraftOrder> = {
    select: defaultAdminDraftOrdersFields,
    relations: defaultAdminDraftOrdersRelations,
    skip: validated.offset ?? 0,
    take: validated.limit ?? 50,
    order: { created_at: "DESC" },
  }

  const [draftOrders, count] = await draftOrderService.listAndCount(
    selector,
    listConfig
  )

  res.json({
    draft_orders: draftOrders,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved draft orders.
 */
export class AdminGetDraftOrdersParams {
  /**
   * Search term to search draft orders by their display IDs and emails.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * {@inheritDoc FindPaginationParams.limit}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
