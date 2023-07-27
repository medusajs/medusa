import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"
import { IsOptional, IsString } from "class-validator"

/**
 * @oas [get] /admin/order-edits
 * operationId: "GetOrderEdits"
 * summary: "List Order Edits"
 * description: "Retrieve a list of order edits. The order edits can be filtered by fields such as `q` or `order_id`. The order edits can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search order edits' internal note.
 *   - (query) order_id {string} Filter by order ID
 *   - (query) limit=20 {number} Limit the number of order edits returned.
 *   - (query) offset=0 {number} The number of order edits to skip when retrieving the order edits.
 *   - (query) expand {string} Comma-separated relations that should be expanded in each returned order edit.
 *   - (query) fields {string} Comma-separated fields that should be included in each returned order edit.
 * x-codegen:
 *   method: list
 *   queryParams: GetOrderEditsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.list()
 *         .then(({ order_edits, count, limit, offset }) => {
 *           console.log(order_edits.length)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl 'https://medusa-url.com/admin/order-edits' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order Edits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderEditsListRes"
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
  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [orderEdits, orderEditCount] = await orderEditService.listAndCount(
    filterableFields,
    listConfig
  )

  for (let orderEdit of orderEdits) {
    orderEdit = await orderEditService.decorateTotals(orderEdit)
  }

  return res.json({
    order_edits: orderEdits,
    count: orderEditCount,
    limit: take,
    offset: skip,
  })
}

export class GetOrderEditsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  order_id?: string
}
