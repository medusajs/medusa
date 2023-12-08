import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/order-edits/{id}
 * operationId: "GetOrderEditsOrderEdit"
 * summary: "Get an Order Edit"
 * description: "Retrieve an Order Edit's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 *   - (query) expand {string} Comma-separated relations that should be expanded in each returned order edit.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order edit.
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
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/order-edits/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Order Edits
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
