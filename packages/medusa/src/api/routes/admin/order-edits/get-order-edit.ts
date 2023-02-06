import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /order-edits/{id}
 * operationId: "GetOrderEditsOrderEdit"
 * summary: "Get an OrderEdit"
 * description: "Retrieves a OrderEdit."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codegen:
 *   method: retrieve
 *   queryParams: GetOrderEditsOrderEditParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.retrieve(orderEditId)
 *         .then(({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/order-edits/{id}' \
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
 *           $ref: "#/components/schemas/AdminOrderEditsRes"
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

  const { id } = req.params
  const retrieveConfig = req.retrieveConfig

  let orderEdit = await orderEditService.retrieve(id, retrieveConfig)
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  return res.json({ order_edit: orderEdit })
}

export class GetOrderEditsOrderEditParams extends FindParams {}
