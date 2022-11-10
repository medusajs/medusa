import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"

/**
 * @oas [delete] /order-edits/{id}/changes/{change_id}
 * operationId: "DeleteOrderEditsOrderEditItemChange"
 * summary: "Delete an Order Edit Item Change"
 * description: "Deletes an Order Edit Item Change"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit to delete.
 *   - (path) change_id=* {string} The ID of the Order Edit Item Change to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.deleteItemChange(order_edit_id, item_change_id)
 *         .then(({ id, object, deleted }) => {
 *           console.log(id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/order-edits/{id}/changes/{change_id}' \
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
 *               description: The ID of the deleted Order Edit Item Change.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               format: item_change
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Order Edit Item Change was deleted.
 *               default: true
 *   "400":
 *     $ref: "#/components/responses/400_error"
 */
export default async (req, res) => {
  const { id, change_id } = req.params

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await orderEditService
      .withTransaction(transactionManager)
      .deleteItemChange(id, change_id)
  })

  res.status(200).send({
    id: change_id,
    object: "item_change",
    deleted: true,
  })
}
