import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"
import { IsOptional, IsString } from "class-validator"

/**
 * @oas [get] /order-edits
 * operationId: "GetOrderEdits"
 * summary: "List OrderEdits"
 * description: "List OrderEdits."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching order edit internal note.
 *   - (query) order_id {string} List order edits by order id.
 *   - (query) limit=20 {number} The number of items in the response
 *   - (query) offset=0 {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
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
 *       curl --location --request GET 'https://medusa-url.com/admin/order-edits' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - OrderEdit
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
