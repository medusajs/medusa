import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"

/**
 * @oas [post] /order-edits/{id}/request-confirmation
 * operationId: "PostOrderEditsOrderEditRequest"
 * summary: "Request order edit confirmation"
 * description: "Request customer confirmation of an Order Edit"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Note to request confirmation from.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.requestConfirmation(edit_id)
 *         .then({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits/{id}/request-confirmation' \
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
 *           properties:
 *             order_edit:
 *               $ref: "#/components/schemas/order_edit"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  const loggedInUserId = (req.user?.id ?? req.user?.userId) as string

  await manager.transaction(async (transactionManager) => {
    await orderEditService
      .withTransaction(transactionManager)
      .requestConfirmation(id, loggedInUserId)
  })

  const orderEdit = await orderEditService.retrieve(id)

  res.status(200).send({
    order_edit: orderEdit,
  })
}
