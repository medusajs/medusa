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
 * summary: "Registers a payment for a Draft Order"
 * operationId: "PostDraftOrdersDraftOrderRegisterPayment"
 * description: "Registers a payment for a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {String} The Draft Order id.
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/draft-order"
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
      .retrieve(draftOrder.cart_id, {
        select: ["total"],
        relations: [
          "discounts",
          "discounts.rule",
          "shipping_methods",
          "region",
          "items",
        ],
      })

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
  })

  const order = await orderService.retrieve(result.id, {
    relations: defaultOrderRelations,
    select: defaultOrderFields,
  })

  res.status(200).json({ order })
}
