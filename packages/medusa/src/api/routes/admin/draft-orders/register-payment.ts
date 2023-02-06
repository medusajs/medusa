import {
  CartService,
  DraftOrderService,
  OrderService,
  PaymentProviderService,
  ProductVariantInventoryService,
} from "../../../../services"
import {
  defaultAdminOrdersFields as defaultOrderFields,
  defaultAdminOrdersRelations as defaultOrderRelations,
} from "../orders/index"

import { EntityManager } from "typeorm"
import { Order } from "../../../../models"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /draft-orders/{id}/pay
 * summary: "Registers a Payment"
 * operationId: "PostDraftOrdersDraftOrderRegisterPayment"
 * description: "Registers a payment for a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {String} The Draft Order id.
 * x-codegen:
 *   method: markPaid
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
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  const order = await entityManager.transaction(async (manager) => {
    const draftOrderServiceTx = draftOrderService.withTransaction(manager)
    const orderServiceTx = orderService.withTransaction(manager)
    const cartServiceTx = cartService.withTransaction(manager)

    const productVariantInventoryServiceTx =
      productVariantInventoryService.withTransaction(manager)

    const draftOrder = await draftOrderServiceTx.retrieve(id)

    const cart = await cartServiceTx.retrieveWithTotals(draftOrder.cart_id)

    await paymentProviderService
      .withTransaction(manager)
      .createSession("system", cart)

    await cartServiceTx.setPaymentSession(cart.id, "system")

    await cartServiceTx.createTaxLines(cart.id)

    await cartServiceTx.authorizePayment(cart.id)

    let order = await orderServiceTx.createFromCart(cart.id)

    await draftOrderServiceTx.registerCartCompletion(draftOrder.id, order.id)

    await orderServiceTx.capturePayment(order.id)

    order = await orderService
      .withTransaction(manager)
      .retrieveWithTotals(order.id, {
        relations: defaultOrderRelations,
        select: defaultOrderFields,
      })

    await reserveQuantityForDraftOrder(order, {
      productVariantInventoryService: productVariantInventoryServiceTx,
    })

    return order
  })

  res.status(200).json({ order })
}

export const reserveQuantityForDraftOrder = async (
  order: Order,
  context: {
    productVariantInventoryService: ProductVariantInventoryService
    locationId?: string
  }
) => {
  const { productVariantInventoryService, locationId } = context
  await Promise.all(
    order.items.map(async (item) => {
      if (item.variant_id) {
        const inventoryConfirmed =
          await productVariantInventoryService.confirmInventory(
            item.variant_id,
            item.quantity,
            { salesChannelId: order.sales_channel_id }
          )

        if (!inventoryConfirmed) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Variant with id: ${item.variant_id} does not have the required inventory`,
            MedusaError.Codes.INSUFFICIENT_INVENTORY
          )
        }

        await productVariantInventoryService.reserveQuantity(
          item.variant_id,
          item.quantity,
          {
            lineItemId: item.id,
            salesChannelId: order.sales_channel_id,
          }
        )
      }
    })
  )
}
