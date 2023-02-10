import { IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { PaymentCollectionType } from "../../../../models"
import {
  OrderEditService,
  OrderService,
  PaymentCollectionService,
} from "../../../../services"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [post] /order-edits/{id}/request
 * operationId: "PostOrderEditsOrderEditRequest"
 * summary: "Request Confirmation"
 * description: "Request customer confirmation of an Order Edit"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit to request confirmation from.
 * x-codegen:
 *   method: requestConfirmation
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.requestConfirmation(order_edit_id)
 *         .then({ order_edit }) => {
 *           console.log(order_edit.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits/{id}/request' \
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
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params
  const validatedBody =
    req.validatedBody as AdminPostOrderEditsRequestConfirmationReq

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const orderService: OrderService = req.scope.resolve("orderService")

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const loggedInUser = (req.user?.id ?? req.user?.userId) as string

  await manager.transaction(async (transactionManager) => {
    const orderEditServiceTx =
      orderEditService.withTransaction(transactionManager)

    const orderEdit = await orderEditServiceTx.requestConfirmation(id, {
      requestedBy: loggedInUser,
    })

    const total = await orderEditServiceTx.decorateTotals(orderEdit)

    if (total.difference_due > 0) {
      const order = await orderService
        .withTransaction(transactionManager)
        .retrieve(orderEdit.order_id, {
          select: ["currency_code", "region_id"],
        })

      const paymentCollection = await paymentCollectionService
        .withTransaction(transactionManager)
        .create({
          type: PaymentCollectionType.ORDER_EDIT,
          amount: total.difference_due,
          currency_code: order.currency_code,
          region_id: order.region_id,
          description: validatedBody.payment_collection_description,
          created_by: loggedInUser,
        })

      orderEdit.payment_collection_id = paymentCollection.id

      await orderEditServiceTx.update(orderEdit.id, {
        payment_collection_id: paymentCollection.id,
      })
    }
  })

  let orderEdit = await orderEditService.retrieve(id, {
    relations: defaultOrderEditRelations,
    select: defaultOrderEditFields,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).send({
    order_edit: orderEdit,
  })
}

export class AdminPostOrderEditsRequestConfirmationReq {
  @IsString()
  @IsOptional()
  payment_collection_description?: string | undefined
}
