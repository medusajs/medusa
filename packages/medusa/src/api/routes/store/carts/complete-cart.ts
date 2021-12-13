import { MedusaError } from "medusa-core-utils"
import {
  CartService,
  IdempotencyKeyService,
  OrderService,
  SwapService,
} from "../../../../services"

import { Order } from "../../../../models/order"

/**
 * @oas [post] /carts/{id}/complete
 * summary: "Complete a Cart"
 * operationId: "PostCartsCartComplete"
 * description: "Completes a cart. The following steps will be performed. Payment
 *   authorization is attempted and if more work is required, we simply return
 *   the cart for further updates. If payment is authorized and order is not yet
 *   created, we make sure to do so. The completion of a cart can be performed
 *   idempotently with a provided header `Idempotency-Key`. If not provided, we
 *   will generate one for the request."
 * parameters:
 *   - (path) id=* {String} The Cart id.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "If a cart was successfully authorized, but requires further
 *       action from the user the response body will contain the cart with an
 *       updated payment session. If the Cart was successfully completed the
 *       response body will contain the newly created Order."
 *     content:
 *       application/json:
 *         schema:
 *           oneOf:
 *            - type: object
 *              properties:
 *                order:
 *                  $ref: "#/components/schemas/order"
 *            - type: object
 *              properties:
 *                cart:
 *                  $ref: "#/components/schemas/cart"
 *            - type: object
 *              properties:
 *                cart:
 *                  $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const { id } = req.params

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    idempotencyKey = await idempotencyKeyService.initializeRequest(
      headerKey,
      req.method,
      req.params,
      req.path
    )
  } catch (error) {
    console.log(error)
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const cartService: CartService = req.scope.resolve("cartService")
  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")

  let inProgress = true
  let err = false

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        const { key, error } = await idempotencyKeyService.workStage(
          idempotencyKey.idempotency_key,
          async (manager) => {
            let cart = await cartService.withTransaction(manager).retrieve(id)

            if (cart.completed_at) {
              return {
                response_code: 409,
                response_body: {
                  code: MedusaError.Codes.CART_INCOMPATIBLE_STATE,
                  message: "Cart has already been completed",
                  type: MedusaError.Types.NOT_ALLOWED,
                },
              }
            }

            cart = await cartService
              .withTransaction(manager)
              .authorizePayment(id, {
                ...req.request_context,
                idempotency_key: idempotencyKey.idempotency_key,
              })

            if (cart.payment_session) {
              if (
                cart.payment_session.status === "requires_more" ||
                cart.payment_session.status === "pending"
              ) {
                return {
                  response_code: 200,
                  response_body: {
                    data: cart,
                    payment_status: cart.payment_session.status,
                    type: "cart",
                  },
                }
              }
            }

            return {
              recovery_point: "payment_authorized",
            }
          }
        )

        if (error) {
          inProgress = false
          err = error
        } else {
          idempotencyKey = key
        }
        break
      }

      case "payment_authorized": {
        const { key, error } = await idempotencyKeyService.workStage(
          idempotencyKey.idempotency_key,
          async (manager) => {
            const cart = await cartService
              .withTransaction(manager)
              .retrieve(id, {
                select: ["total"],
                relations: ["payment", "payment_sessions"],
              })

            let order: Order

            // If cart is part of swap, we register swap as complete
            switch (cart.type) {
              case "swap": {
                try {
                  const swapId = cart.metadata?.swap_id
                  let swap = await swapService
                    .withTransaction(manager)
                    .registerCartCompletion(swapId)

                  swap = await swapService
                    .withTransaction(manager)
                    .retrieve(swap.id, { relations: ["shipping_address"] })

                  return {
                    response_code: 200,
                    response_body: { data: swap, type: "swap" },
                  }
                } catch (error) {
                  if (
                    error &&
                    error.code === MedusaError.Codes.INSUFFICIENT_INVENTORY
                  ) {
                    return {
                      response_code: 409,
                      response_body: {
                        message: error.message,
                        type: error.type,
                        code: error.code,
                      },
                    }
                  } else {
                    throw error
                  }
                }
              }
              // case "payment_link":
              default: {
                if (typeof cart.total === "undefined") {
                  return {
                    response_code: 500,
                    response_body: {
                      message: "Unexpected state",
                    },
                  }
                }

                if (!cart.payment && cart.total > 0) {
                  throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Cart payment not authorized`
                  )
                }

                try {
                  order = await orderService
                    .withTransaction(manager)
                    .createFromCart(cart.id)
                } catch (error) {
                  if (
                    error &&
                    error.message === "Order from cart already exists"
                  ) {
                    order = await orderService
                      .withTransaction(manager)
                      .retrieveByCartId(id, {
                        select: [
                          "subtotal",
                          "tax_total",
                          "shipping_total",
                          "discount_total",
                          "total",
                        ],
                        relations: ["shipping_address", "items", "payments"],
                      })

                    return {
                      response_code: 200,
                      response_body: { data: order, type: "order" },
                    }
                  } else if (
                    error &&
                    error.code === MedusaError.Codes.INSUFFICIENT_INVENTORY
                  ) {
                    return {
                      response_code: 409,
                      response_body: {
                        message: error.message,
                        type: error.type,
                        code: error.code,
                      },
                    }
                  } else {
                    throw error
                  }
                }
              }
            }

            order = await orderService
              .withTransaction(manager)
              .retrieve(order.id, {
                select: [
                  "subtotal",
                  "tax_total",
                  "shipping_total",
                  "discount_total",
                  "total",
                ],
                relations: ["shipping_address", "items", "payments"],
              })

            return {
              response_code: 200,
              response_body: { data: order, type: "order" },
            }
          }
        )

        if (error) {
          inProgress = false
          err = error
        } else {
          idempotencyKey = key
        }
        break
      }

      case "finished": {
        inProgress = false
        break
      }

      default:
        idempotencyKey = await idempotencyKeyService.update(
          idempotencyKey.idempotency_key,
          {
            recovery_point: "finished",
            response_code: 500,
            response_body: { message: "Unknown recovery point" },
          }
        )
        break
    }
  }

  if (err) {
    throw err
  }

  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}
