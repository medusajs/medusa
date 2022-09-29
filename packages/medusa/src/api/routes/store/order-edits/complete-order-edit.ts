import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations,
} from "../../../../types/order-edit"
import { OrderEditStatus } from "../../../../models"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /order-edits/{id}/complete
 * operationId: "PostOrderEditsOrderEditComplete"
 * summary: "Completes an OrderEdit"
 * description: "Completes an OrderEdit."
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orderEdit.complete(orderEditId)
 *         .then(({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/order-edits/{id}/complete'
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

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  const userId = req.user?.customer_id ?? req.user?.id ?? req.user?.userId

  await manager.transaction(async (manager) => {
    const orderEditServiceTx = orderEditService.withTransaction(manager)
    const orderEdit = await orderEditServiceTx.retrieve(id)

    if (orderEdit.status === OrderEditStatus.CONFIRMED) {
      return orderEdit
    }

    if (orderEdit.status !== OrderEditStatus.REQUESTED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot complete an order edit with status ${orderEdit.status}`
      )
    }

    // TODO once payment collection is done
    /*const paymentCollection = await this.paymentCollectionService_.withTransaction(manager).retrieve(orderEdit.payment_collection_id)
    if (!paymentCollection.authorized_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Unable to complete an order edit if the payment is not authorized"
      )
    }*/

    return await orderEditServiceTx.confirm(id, {
      loggedInUserId: userId,
    })
  })

  let orderEdit = await orderEditService.retrieve(id, {
    select: defaultStoreOrderEditFields,
    relations: defaultStoreOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).json({ order_edit: orderEdit })
}
