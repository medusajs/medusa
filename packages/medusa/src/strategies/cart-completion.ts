import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"

import { IdempotencyKey } from "../models/idempotency-key"
import { Order } from "../models/order"
import CartService from "../services/cart"
import { RequestContext } from "../types/request"
import OrderService from "../services/order"
import IdempotencyKeyService from "../services/idempotency-key"
import SwapService from "../services/swap"

import { ICartCompletionStrategy, CartCompletionResponse } from "../interfaces"

class CartCompletionStrategy implements ICartCompletionStrategy {
  private idempotencyKeyService_: IdempotencyKeyService
  private cartService_: CartService
  private orderService_: OrderService
  private swapService_: SwapService

  constructor({
    idempotencyKeyService,
    cartService,
    orderService,
    swapService,
  }) {
    this.idempotencyKeyService_ = idempotencyKeyService
    this.cartService_ = cartService
    this.orderService_ = orderService
    this.swapService_ = swapService
  }

  async complete(
    id: string,
    ikey: IdempotencyKey,
    context: RequestContext
  ): Promise<CartCompletionResponse> {
    let idempotencyKey: IdempotencyKey = ikey

    const idempotencyKeyService = this.idempotencyKeyService_
    const cartService = this.cartService_
    const orderService = this.orderService_
    const swapService = this.swapService_

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async (manager: EntityManager) => {
              const cart = await cartService
                .withTransaction(manager)
                .retrieve(id)

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

              await cartService.withTransaction(manager).createTaxLines(id)

              return {
                recovery_point: "tax_lines_created",
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
        case "tax_lines_created": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async (manager: EntityManager) => {
              const cart = await cartService
                .withTransaction(manager)
                .authorizePayment(id, {
                  ...context,
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
            async (manager: EntityManager) => {
              const cart = await cartService
                .withTransaction(manager)
                .retrieve(id, {
                  select: ["total"],
                  relations: ["payment", "payment_sessions"],
                })

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

                  let order: Order
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

    return {
      response_body: idempotencyKey.response_body,
      response_code: idempotencyKey.response_code,
    }
  }
}

export default CartCompletionStrategy
