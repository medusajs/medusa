import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /order-edits/{id}/cancel
 * operationId: "PostOrderEditsOrderEditCancel"
 * summary: "Cancel an OrderEdit"
 * description: "Cancels an OrderEdit."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdit.cancel(orderEditId)
 *         .then(({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits/:id/cancel' \
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
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const orderEditService = req.scope.resolve(
    "orderEditService"
  ) as OrderEditService

  const manager = req.scope.resolve("manager") as EntityManager

  const userId = req.user?.id ?? req.user?.userId

  await manager.transaction(async (transactionManager) => {
    await orderEditService
      .withTransaction(transactionManager)
      .cancel(id, { loggedInUser: userId })
  })

  const orderEdit = await orderEditService.retrieve(id)

  return res.json({ order_edit: orderEdit })
}
