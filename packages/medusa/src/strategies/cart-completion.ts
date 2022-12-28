import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { IdempotencyKey, Order } from "../models"
import CartService from "../services/cart"
import IdempotencyKeyService from "../services/idempotency-key"
import OrderService, {
  ORDER_CART_ALREADY_EXISTS_ERROR,
} from "../services/order"
import SwapService from "../services/swap"
import { RequestContext } from "../types/request"

import {
  AbstractCartCompletionStrategy,
  CartCompletionResponse,
} from "../interfaces"
import {
  PaymentProviderService,
  ProductVariantInventoryService,
} from "../services"

type InjectedDependencies = {
  productVariantInventoryService: ProductVariantInventoryService
  paymentProviderService: PaymentProviderService
  idempotencyKeyService: IdempotencyKeyService
  cartService: CartService
  orderService: OrderService
  swapService: SwapService
  manager: EntityManager
}

class CartCompletionStrategy extends AbstractCartCompletionStrategy {
  protected manager_: EntityManager

  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly idempotencyKeyService_: IdempotencyKeyService
  protected readonly cartService_: CartService
  protected readonly orderService_: OrderService
  protected readonly swapService_: SwapService

  constructor({
    productVariantInventoryService,
    paymentProviderService,
    idempotencyKeyService,
    cartService,
    orderService,
    swapService,
    manager,
  }: InjectedDependencies) {
    super()

    this.paymentProviderService_ = paymentProviderService
    this.productVariantInventoryService_ = productVariantInventoryService
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

    let inProgress = true
    let err: unknown = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          await this.manager_
            .transaction("SERIALIZABLE", async (transactionManager) => {
              idempotencyKey = await this.idempotencyKeyService_
                .withTransaction(transactionManager)
                .workStage(
                  idempotencyKey.idempotency_key,
                  async (manager) =>
                    await this.handleCreateTaxLines(id, { manager })
                )
            })
            .catch((e) => {
              inProgress = false
              err = e
            })
          break
        }
        case "tax_lines_created": {
          await this.manager_
            .transaction("SERIALIZABLE", async (transactionManager) => {
              idempotencyKey = await this.idempotencyKeyService_
                .withTransaction(transactionManager)
                .workStage(
                  idempotencyKey.idempotency_key,
                  async (manager) =>
                    await this.handleTaxLineCreated(id, idempotencyKey, {
                      context,
                      manager,
                    })
                )
            })
            .catch((e) => {
              inProgress = false
              err = e
            })
          break
        }

        case "payment_authorized": {
          await this.manager_
            .transaction("SERIALIZABLE", async (transactionManager) => {
              idempotencyKey = await this.idempotencyKeyService_
                .withTransaction(transactionManager)
                .workStage(
                  idempotencyKey.idempotency_key,
                  async (manager) =>
                    await this.handlePaymentAuthorized(id, { manager })
                )
            })
            .catch((e) => {
              inProgress = false
              err = e
            })
          break
        }

        case "finished": {
          inProgress = false
          break
        }

        default:
          await this.manager_.transaction(async (transactionManager) => {
            idempotencyKey = await this.idempotencyKeyService_
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
            await this.orderService_
              .withTransaction(transactionManager)
              .retrieveByCartId(id)
          } catch (error) {
            await this.cartService_
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

  protected async handleCreateTaxLines(
    id: string,
    { manager }: { manager: EntityManager }
  ) {
    const cart = await this.cartService_.withTransaction(manager).retrieve(id, {
      relations: [
        "customer",
        "discounts",
        "discounts.rule",
        "gift_cards",
        "items",
        "items.adjustments",
        "region",
        "region.tax_rates",
        "shipping_address",
        "shipping_methods",
      ],
    })

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

    await this.cartService_.withTransaction(manager).createTaxLines(cart)

    return {
      recovery_point: "tax_lines_created",
    }
  }

  protected async handleTaxLineCreated(
    id: string,
    idempotencyKey: IdempotencyKey,
    { context, manager }: { context: any; manager: EntityManager }
  ) {
    const res = await this.handleCreateTaxLines(id, { manager })
    if (res.response_code) {
      return res
    }

    const cart = await this.cartService_
      .withTransaction(manager)
      .authorizePayment(id, {
        ...context,
        cart_id: id,
        idempotency_key: idempotencyKey,
      })

    if (cart.payment_session) {
      if (
        cart.payment_session.status === "requires_more" ||
        cart.payment_session.status === "pending"
      ) {
        await this.cartService_.withTransaction(manager).deleteTaxLines(id)

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

  protected async handlePaymentAuthorized(
    id: string,
    { manager }: { manager: EntityManager }
  ) {
    const res = await this.handleCreateTaxLines(id, { manager })
    if (res.response_code) {
      return res
    }

    const orderServiceTx = this.orderService_.withTransaction(manager)
    const swapServiceTx = this.swapService_.withTransaction(manager)
    const cartServiceTx = this.cartService_.withTransaction(manager)

    const cart = await cartServiceTx.retrieveWithTotals(id, {
      relations: ["region", "payment", "payment_sessions"],
    })

    let allowBackorder = false
    let swapId: string

    if (cart.type === "swap") {
      const swap = await swapServiceTx.retrieveByCartId(id)
      allowBackorder = swap.allow_backorder
      swapId = swap.id
    }

    if (!allowBackorder) {
      const productVariantInventoryServiceTx =
        this.productVariantInventoryService_.withTransaction(manager)

      try {
        await Promise.all(
          cart.items.map(async (item) => {
            if (item.variant_id) {
              const inventoryConfirmed =
                await productVariantInventoryServiceTx.confirmInventory(
                  item.variant_id,
                  item.quantity,
                  { salesChannelId: cart.sales_channel_id }
                )

              if (!inventoryConfirmed) {
                throw new MedusaError(
                  MedusaError.Types.NOT_ALLOWED,
                  `Variant with id: ${item.variant_id} does not have the required inventory`,
                  MedusaError.Codes.INSUFFICIENT_INVENTORY
                )
              }

              await productVariantInventoryServiceTx.reserveQuantity(
                item.variant_id,
                item.quantity,
                {
                  lineItemId: item.id,
                  salesChannelId: cart.sales_channel_id,
                }
              )
            }
          })
        )
      } catch (error) {
        if (error && error.code === MedusaError.Codes.INSUFFICIENT_INVENTORY) {
          if (cart.payment) {
            await this.paymentProviderService_
              .withTransaction(manager)
              .cancelPayment(cart.payment)
          }
          await cartServiceTx.update(cart.id, {
            payment_authorized_at: null,
          })

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

    // If cart is part of swap, we register swap as complete
    if (cart.type === "swap") {
      try {
        const swapId = cart.metadata?.swap_id
        let swap = await swapServiceTx.registerCartCompletion(swapId as string)

        swap = await swapServiceTx.retrieve(swap.id, {
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

    if (!cart.payment && cart.total! > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cart payment not authorized`
      )
    }

    let order: Order
    try {
      order = await orderServiceTx.createFromCart(cart)
    } catch (error) {
      if (error && error.message === ORDER_CART_ALREADY_EXISTS_ERROR) {
        order = await orderServiceTx.retrieveByCartId(id, {
          relations: ["shipping_address", "payments"],
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

    order = await orderServiceTx.retrieveWithTotals(order.id, {
      relations: ["shipping_address", "items", "payments"],
    })

    return {
      response_code: 200,
      response_body: { data: order, type: "order" },
    }
  }
}

export default CartCompletionStrategy
