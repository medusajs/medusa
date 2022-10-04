import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"

/**
 * @oas [delete] /order-edits/{id}
 * operationId: "DeleteOrderEditsOrderEdit"
 * summary: "Delete an Order Edit"
 * description: "Deletes an Order Edit"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.delete(edit_id)
 *         .then(({ id, object, deleted }) => {
 *           console.log(id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/order-edits/{id}' \
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
 *             id:
 *               type: string
 *               description: The ID of the deleted Order Edit.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               format: order_edit
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Order Edit was deleted.
 *               default: true
 *   "400":
 *     $ref: "#/components/responses/400_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await orderEditService.withTransaction(transactionManager).delete(id)
  })

  res.status(200).send({
    id,
    object: "order_edit",
    deleted: true,
  })
}
