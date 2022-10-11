import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { IdempotencyKey, Order } from "../models"
import CartService from "../services/cart"
import IdempotencyKeyService from "../services/idempotency-key"
import OrderService from "../services/order"
import SwapService from "../services/swap"
import { RequestContext } from "../types/request"

import {
  AbstractCartCompletionStrategy,
  CartCompletionResponse,
} from "../interfaces"

type InjectedDependencies = {
  idempotencyKeyService: IdempotencyKeyService
  cartService: CartService
  orderService: OrderService
  swapService: SwapService
  manager: EntityManager
}

class CartCompletionStrategy extends AbstractCartCompletionStrategy {
  protected manager_: EntityManager

  protected readonly idempotencyKeyService_: IdempotencyKeyService
  protected readonly cartService_: CartService
  protected readonly orderService_: OrderService
  protected readonly swapService_: SwapService

  constructor({
    idempotencyKeyService,
    cartService,
    orderService,
    swapService,
    manager,
  }: InjectedDependencies) {
    super()

    this.idempotencyKeyService_ = idempotencyKeyService
    this.cartService_ = cartService
    this.orderService_ = orderService
    this.swapService_ = swapService
    this.manager_ = manager
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
    let err: unknown = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          await this.manager_.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(
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
              idempotencyKey = key as IdempotencyKey
            }
          })
          break
        }
        case "tax_lines_created": {
          await this.manager_.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(
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
                      await cartService
                        .withTransaction(transactionManager)
                        .deleteTaxLines(id)

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
              idempotencyKey = key as IdempotencyKey
            }
          })
          break
        }

        case "payment_authorized": {
          await this.manager_.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(
                idempotencyKey.idempotency_key,
                async (manager: EntityManager) => {
                  const cart = await cartService
                    .withTransaction(manager)
                    .retrieveWithTotals(id, {
                      relations: ["payment", "payment_sessions"],
                    })

                  // If cart is part of swap, we register swap as complete
                  switch (cart.type) {
                    case "swap": {
                      try {
                        const swapId = cart.metadata?.swap_id
                        let swap = await swapService
                          .withTransaction(manager)
                          .registerCartCompletion(swapId as string)

                        swap = await swapService
                          .withTransaction(manager)
                          .retrieve(swap.id, {
                            relations: ["shipping_address"],
                          })

                        return {
                          response_code: 200,
                          response_body: { data: swap, type: "swap" },
                        }
                      } catch (error) {
                        if (
                          error &&
                          error.code ===
                            MedusaError.Codes.INSUFFICIENT_INVENTORY
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
                              relations: [
                                "shipping_address",
                                "items",
                                "payments",
                              ],
                            })

                          return {
                            response_code: 200,
                            response_body: { data: order, type: "order" },
                          }
                        } else if (
                          error &&
                          error.code ===
                            MedusaError.Codes.INSUFFICIENT_INVENTORY
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
              idempotencyKey = key as IdempotencyKey
            }
          })
          break
        }

        case "finished": {
          inProgress = false
          break
        }

        default:
          await this.manager_.transaction(async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .update(idempotencyKey.idempotency_key, {
                recovery_point: "finished",
                response_code: 500,
                response_body: { message: "Unknown recovery point" },
              })
          })
          break
      }
    }

    if (err) {
      if (idempotencyKey.recovery_point !== "started") {
        await this.manager_.transaction(async (transactionManager) => {
          try {
            await orderService
              .withTransaction(transactionManager)
              .retrieveByCartId(id)
          } catch (error) {
            await cartService
              .withTransaction(transactionManager)
              .deleteTaxLines(id)
          }
        })
      }
      throw err
    }

    return {
      response_body: idempotencyKey.response_body,
      response_code: idempotencyKey.response_code,
    }
  }
}

export default CartCompletionStrategy
