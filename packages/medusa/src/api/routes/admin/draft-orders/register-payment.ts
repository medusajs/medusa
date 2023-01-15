import {
  CartService,
  DraftOrderService,
  OrderService,
  PaymentProviderService,
} from "../../../../services"
import {
  defaultAdminOrdersFields as defaultOrderFields,
  defaultAdminOrdersRelations as defaultOrderRelations,
} from "../orders/index"

import { EntityManager } from "typeorm"

/**
 * @oas [post] /draft-orders/{id}/pay
 * summary: "Registers a Payment"
 * operationId: "PostDraftOrdersDraftOrderRegisterPayment"
 * description: "Registers a payment for a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {String} The Draft Order id.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.markPaid(draft_order_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}/pay' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPostDraftOrdersDraftOrderRegisterPaymentRes"
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

export default async (req, res) => {
  const { id } = req.params

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )
  const orderService: OrderService = req.scope.resolve("orderService")
  const cartService: CartService = req.scope.resolve("cartService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  let result
  await entityManager.transaction(async (manager) => {
    const draftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id)

    const cart = await cartService
      .withTransaction(manager)
      .retrieveWithTotals(draftOrder.cart_id)

    await paymentProviderService
      .withTransaction(manager)
      .createSession("system", cart)

    await cartService
      .withTransaction(manager)
      .setPaymentSession(cart.id, "system")

    await cartService.withTransaction(manager).createTaxLines(cart.id)

    await cartService.withTransaction(manager).authorizePayment(cart.id)

    result = await orderService.withTransaction(manager).createFromCart(cart.id)

    await draftOrderService
      .withTransaction(manager)
      .registerCartCompletion(draftOrder.id, result.id)

    await orderService.withTransaction(manager).capturePayment(result.id)
  })

  const order = await orderService.retrieveWithTotals(result.id, {
    relations: defaultOrderRelations,
    select: defaultOrderFields,
  })

  res.status(200).json({ order })
}
