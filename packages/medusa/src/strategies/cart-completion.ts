import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import {
  Cart,
  CartType,
  IdempotencyKey,
  Order,
  PaymentSessionStatus,
} from "../models"
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

enum IdempotencyKeyRecoveryPoint {
  STARTED = "started",
  TAX_LINES_CREATED = "tax_lines_created",
  PAYMENT_AUTHORIZED = "payment_authorized",
  FINISHED = "finished",
}

type CartCompletionStep = {
  key?: IdempotencyKey
  error?: unknown
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
    const args = {
      id,
      ikey,
      context,
    }

    const commands: { [key: string]: Function } = {
      [IdempotencyKeyRecoveryPoint.STARTED]: this.startStep,
      [IdempotencyKeyRecoveryPoint.TAX_LINES_CREATED]: this.taxLinesStep,
      [IdempotencyKeyRecoveryPoint.PAYMENT_AUTHORIZED]: this.paymentStep,
    }

    let idempotencyKey: IdempotencyKey = ikey
    while (
      idempotencyKey.recovery_point !== IdempotencyKeyRecoveryPoint.FINISHED
    ) {
      let result: CartCompletionStep

      const step = idempotencyKey.recovery_point
      if (typeof commands[step] === "function") {
        result = await commands[step].bind(this)(args)
      } else {
        result = await this.unknownStep(args)
      }

      if (result.key) {
        idempotencyKey = result.key
      } else {
        throw result.error
      }
    }

    return {
      response_body: idempotencyKey.response_body,
      response_code: idempotencyKey.response_code,
    }
  }

  private async startStep({
    id,
    ikey,
  }: {
    id: string
    ikey: IdempotencyKey
  }): Promise<CartCompletionStep> {
    let keyReturn: IdempotencyKey | undefined
    let errorReturn: unknown

    await this.manager_.transaction(async (transactionManager) => {
      const { key, error } = await this.idempotencyKeyService_
        .withTransaction(transactionManager)
        .workStage(ikey.idempotency_key, async (manager: EntityManager) => {
          const cart = await this.cartService_
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

          await this.cartService_.withTransaction(manager).createTaxLines(id)
          return {
            recovery_point: IdempotencyKeyRecoveryPoint.TAX_LINES_CREATED,
          }
        })

      keyReturn = key
      errorReturn = error
    })

    return {
      key: keyReturn,
      error: errorReturn,
    }
  }

  private async taxLinesStep({
    id,
    ikey,
    context,
  }: {
    id: string
    ikey: IdempotencyKey
    context: RequestContext
  }): Promise<CartCompletionStep> {
    let keyReturn: IdempotencyKey | undefined
    let errorReturn: unknown

    await this.manager_.transaction(async (transactionManager) => {
      const { key, error } = await this.idempotencyKeyService_
        .withTransaction(transactionManager)
        .workStage(ikey.idempotency_key, async (manager: EntityManager) => {
          const cart = await this.cartService_
            .withTransaction(manager)
            .authorizePayment(id, {
              ...context,
              idempotency_key: ikey.idempotency_key,
            })

          if (cart.payment_session) {
            if (
              cart.payment_session.status ===
                PaymentSessionStatus.REQUIRES_MORE ||
              cart.payment_session.status === PaymentSessionStatus.PENDING
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
            recovery_point: IdempotencyKeyRecoveryPoint.PAYMENT_AUTHORIZED,
          }
        })

      keyReturn = key
      errorReturn = error
    })
    return {
      key: keyReturn,
      error: errorReturn,
    }
  }

  private async paymentStep({
    id,
    ikey,
  }: {
    id: string
    ikey: IdempotencyKey
  }): Promise<CartCompletionStep> {
    let keyReturn: IdempotencyKey | undefined
    let errorReturn: unknown

    await this.manager_.transaction(async (transactionManager) => {
      const { key, error } = await this.idempotencyKeyService_
        .withTransaction(transactionManager)
        .workStage(ikey.idempotency_key, async (manager: EntityManager) => {
          const cart = await this.cartService_
            .withTransaction(manager)
            .retrieve(id, {
              select: ["total"],
              relations: [
                "items",
                "items.adjustments",
                "payment",
                "payment_sessions",
              ],
            })

          // If cart is part of swap, we register swap as complete
          if (cart.type === CartType.SWAP) {
            return await this.completeSwap(cart, manager)
          } else {
            return await this.completeCart(id, cart, manager)
          }
        })

      keyReturn = key
      errorReturn = error
    })
    return {
      key: keyReturn,
      error: errorReturn,
    }
  }

  private async completeSwap(cart: Cart, manager: EntityManager) {
    try {
      const swapId = cart.metadata?.swap_id
      let swap = await this.swapService_
        .withTransaction(manager)
        .registerCartCompletion(swapId as string)

      swap = await this.swapService_
        .withTransaction(manager)
        .retrieve(swap.id, {
          relations: ["shipping_address"],
        })

      return {
        response_code: 200,
        response_body: { data: swap, type: "swap" },
      }
    } catch (error) {
      if (error && error.code === MedusaError.Codes.INSUFFICIENT_INVENTORY) {
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

  private async completeCart(id: string, cart: Cart, manager: EntityManager) {
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
      order = await this.orderService_
        .withTransaction(manager)
        .createFromCart(cart.id)
    } catch (error) {
      if (error && error.message === "Order from cart already exists") {
        order = await this.orderService_
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

    order = await this.orderService_
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

  private async unknownStep({
    ikey,
  }: {
    ikey: IdempotencyKey
  }): Promise<CartCompletionStep> {
    let key
    await this.manager_.transaction(async (transactionManager) => {
      key = await this.idempotencyKeyService_
        .withTransaction(transactionManager)
        .update(ikey.idempotency_key, {
          recovery_point: IdempotencyKeyRecoveryPoint.FINISHED,
          response_code: 500,
          response_body: { message: "Unknown recovery point" },
        })
    })
    return {
      key,
    }
  }
}

export default CartCompletionStrategy
