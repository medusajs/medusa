import { Request, Response } from "express"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { OrderEditStatus, PaymentCollectionStatus } from "../../../../models"
import { OrderEditService, PaymentProviderService } from "../../../../services"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /order-edits/{id}/complete
 * operationId: "PostOrderEditsOrderEditComplete"
 * summary: "Completes an OrderEdit"
 * description: "Completes an OrderEdit."
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit.
 * x-codegen:
 *   method: complete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orderEdits.complete(order_edit_id)
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
 *           $ref: "#/components/schemas/StoreOrderEditsRes"
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

  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const userId = req.user?.customer_id ?? req.user?.id ?? req.user?.userId

  await manager.transaction(async (manager) => {
    const orderEditServiceTx = orderEditService.withTransaction(manager)
    const paymentProviderServiceTx =
      paymentProviderService.withTransaction(manager)

    const orderEdit = await orderEditServiceTx.retrieve(id, {
      relations: ["payment_collection", "payment_collection.payments"],
    })

    const allowedStatus = [OrderEditStatus.REQUESTED, OrderEditStatus.CONFIRMED]
    if (
      orderEdit.payment_collection &&
      allowedStatus.includes(orderEdit.status)
    ) {
      if (
        orderEdit.payment_collection.status !==
        PaymentCollectionStatus.AUTHORIZED
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Unable to complete an order edit if the payment is not authorized"
        )
      }

      if (orderEdit.payment_collection) {
        for (const payment of orderEdit.payment_collection.payments) {
          if (payment.order_id !== orderEdit.order_id) {
            await paymentProviderServiceTx.updatePayment(payment.id, {
              order_id: orderEdit.order_id,
            })
          }
        }
      }
    }

    if (orderEdit.status === OrderEditStatus.CONFIRMED) {
      return orderEdit
    }

    if (orderEdit.status !== OrderEditStatus.REQUESTED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot complete an order edit with status ${orderEdit.status}`
      )
    }

    const returned = await orderEditServiceTx.confirm(id, {
      confirmedBy: userId,
    })

    return returned
  })

  let orderEdit = await orderEditService.retrieve(id, {
    select: defaultStoreOrderEditFields,
    relations: defaultStoreOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).json({ order_edit: orderEdit })
}
