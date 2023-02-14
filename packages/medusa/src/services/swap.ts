import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"

import { TransactionBaseService } from "../interfaces"
import { buildQuery, setMetadata, validateId } from "../utils"

import {
  Cart,
  CartType,
  FulfillmentItem,
  FulfillmentStatus,
  LineItem,
  Order,
  PaymentSessionStatus,
  PaymentStatus,
  ReturnItem,
  ReturnStatus,
  Swap,
  SwapFulfillmentStatus,
  SwapPaymentStatus,
} from "../models"
import { SwapRepository } from "../repositories/swap"
import { FindConfig, Selector, WithRequiredProperty } from "../types/common"
import { CreateShipmentConfig } from "../types/fulfillment"
import { OrdersReturnItem } from "../types/orders"
import CartService from "./cart"
import {
  CustomShippingOptionService,
  EventBusService,
  FulfillmentService,
  LineItemService,
  OrderService,
  PaymentProviderService,
  ProductVariantInventoryService,
  ReturnService,
  ShippingOptionService,
  TotalsService,
} from "./index"
import LineItemAdjustmentService from "./line-item-adjustment"

type InjectedProps = {
  manager: EntityManager

  swapRepository: typeof SwapRepository

  cartService: CartService
  eventBus: EventBusService
  orderService: OrderService
  returnService: ReturnService
  totalsService: TotalsService
  eventBusService: EventBusService
  lineItemService: LineItemService
  productVariantInventoryService: ProductVariantInventoryService
  fulfillmentService: FulfillmentService
  shippingOptionService: ShippingOptionService
  paymentProviderService: PaymentProviderService
  lineItemAdjustmentService: LineItemAdjustmentService
  customShippingOptionService: CustomShippingOptionService
}

/**
 * Handles swaps
 */
class SwapService extends TransactionBaseService {
  static Events = {
    CREATED: "swap.created",
    RECEIVED: "swap.received",
    SHIPMENT_CREATED: "swap.shipment_created",
    PAYMENT_COMPLETED: "swap.payment_completed",
    PAYMENT_CAPTURED: "swap.payment_captured",
    PAYMENT_CAPTURE_FAILED: "swap.payment_capture_failed",
    PROCESS_REFUND_FAILED: "swap.process_refund_failed",
    REFUND_PROCESSED: "swap.refund_processed",
    FULFILLMENT_CREATED: "swap.fulfillment_created",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly swapRepository_: typeof SwapRepository

  protected readonly cartService_: CartService
  protected readonly eventBus_: EventBusService
  protected readonly orderService_: OrderService
  protected readonly returnService_: ReturnService
  protected readonly totalsService_: TotalsService
  protected readonly lineItemService_: LineItemService
  protected readonly fulfillmentService_: FulfillmentService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly lineItemAdjustmentService_: LineItemAdjustmentService
  protected readonly customShippingOptionService_: CustomShippingOptionService
  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService

  constructor({
    manager,
    swapRepository,
    eventBusService,
    cartService,
    totalsService,
    returnService,
    lineItemService,
    paymentProviderService,
    shippingOptionService,
    fulfillmentService,
    orderService,
    productVariantInventoryService,
    customShippingOptionService,
    lineItemAdjustmentService,
  }: InjectedProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager

    this.swapRepository_ = swapRepository
    this.totalsService_ = totalsService
    this.lineItemService_ = lineItemService
    this.returnService_ = returnService
    this.paymentProviderService_ = paymentProviderService
    this.cartService_ = cartService
    this.fulfillmentService_ = fulfillmentService
    this.orderService_ = orderService
    this.shippingOptionService_ = shippingOptionService
    this.productVariantInventoryService_ = productVariantInventoryService
    this.eventBus_ = eventBusService
    this.customShippingOptionService_ = customShippingOptionService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
  }

  /**
   * Transform find config object for retrieval.
   *
   * @param config parsed swap find config
   * @return transformed find swap config
   */
  protected transformQueryForCart(
    config: Omit<FindConfig<Swap>, "select"> & { select?: string[] }
  ): Omit<FindConfig<Swap>, "select"> & { select?: string[] } & {
    cartSelects: FindConfig<Cart>["select"]
    cartRelations: FindConfig<Cart>["relations"]
  } {
    let { select, relations } = config

    let cartSelects: FindConfig<Cart>["select"]
    let cartRelations: FindConfig<Cart>["relations"]

    if (isDefined(relations) && relations.includes("cart")) {
      const [swapRelations, cartRels] = relations.reduce(
        (acc: string[][], next) => {
          if (next === "cart") {
            return acc
          }

          if (next.startsWith("cart.")) {
            const [, ...rel] = next.split(".")
            acc[1].push(rel.join("."))
          } else {
            acc[0].push(next)
          }

          return acc
        },
        [[], []]
      )

      relations = swapRelations
      cartRelations = cartRels

      let foundCartId = false
      if (isDefined(select)) {
        const [swapSelects, cartSels] = select.reduce(
          (acc, next) => {
            if (next.startsWith("cart.")) {
              const [, ...rel] = next.split(".")
              acc[1].push(rel.join("."))
            } else {
              if (next === "cart_id") {
                foundCartId = true
              }
              acc[0].push(next)
            }

            return acc
          },
          [[] as string[], [] as string[]]
        )

        select = foundCartId ? swapSelects : [...swapSelects, "cart_id"]
        ;(cartSelects as string[]) = cartSels
      }
    }

    return {
      ...config,
      relations,
      select,
      cartSelects,
      cartRelations,
    }
  }

  /**
   * Retrieves a swap with the given id.
   *
   * @param swapId - the id of the swap to retrieve
   * @param config - the configuration to retrieve the swap
   * @return the swap
   */
  async retrieve(
    swapId: string,
    config: Omit<FindConfig<Swap>, "select"> & { select?: string[] } = {}
  ): Promise<Swap | never> {
    if (!isDefined(swapId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"swapId" must be defined`
      )
    }

    const swapRepo = this.manager_.getCustomRepository(this.swapRepository_)

    const { cartSelects, cartRelations, ...newConfig } =
      this.transformQueryForCart(config)

    const query = buildQuery({ id: swapId }, newConfig)

    const relations = query.relations as (keyof Swap)[]
    delete query.relations

    const swap = await swapRepo.findOneWithRelations(
      relations,
      query as FindConfig<Swap>
    )

    if (!swap) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Swap was not found")
    }

    if (cartRelations || cartSelects) {
      swap.cart = await this.cartService_
        .withTransaction(this.manager_)
        .retrieve(swap.cart_id, {
          select: cartSelects,
          relations: cartRelations,
        })
    }

    return swap
  }

  /**
   * Retrieves a swap based on its associated cart id
   *
   * @param cartId - the cart id that the swap's cart has
   * @param relations - the relations to retrieve swap
   * @return the swap
   */
  async retrieveByCartId(
    cartId: string,
    relations: FindConfig<Swap>["relations"] = []
  ): Promise<Swap | never> {
    const swapRepo = this.manager_.getCustomRepository(this.swapRepository_)

    const swap = await swapRepo.findOne({
      where: {
        cart_id: cartId,
      },
      relations,
    })

    if (!swap) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Swap was not found")
    }

    return swap
  }

  /**
   * List swaps.
   *
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return the result of the find operation
   */
  async list(
    selector: Selector<Swap>,
    config: FindConfig<Swap> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<Swap[]> {
    const swapRepo = this.manager_.getCustomRepository(this.swapRepository_)
    const query = buildQuery(selector, config)

    const relations = query.relations as (keyof Swap)[]
    delete query.relations

    return await swapRepo.findWithRelations(relations, query)
  }

  /**
   * Creates a swap from an order, with given return items, additional items
   * and an optional return shipping method.
   *
   * @param order - the order to base the swap off
   * @param returnItems - the items to return in the swap
   * @param additionalItems - the items to send to the customer
   * @param returnShipping - an optional shipping method for returning the returnItems
   * @param custom - contains relevant custom information. This object may
   *  include no_notification which will disable sending notification when creating
   *  swap. If set, it overrules the attribute inherited from the order
   * @return the newly created swap
   */
  async create(
    order: Order,
    returnItems: WithRequiredProperty<Partial<ReturnItem>, "item_id">[],
    additionalItems?: Pick<LineItem, "variant_id" | "quantity">[],
    returnShipping?: { option_id: string; price?: number },
    custom: {
      no_notification?: boolean
      idempotency_key?: string
      allow_backorder?: boolean
    } = { no_notification: undefined }
  ): Promise<Swap | never> {
    const { no_notification, ...rest } = custom
    return await this.atomicPhase_(async (manager) => {
      if (order.payment_status !== PaymentStatus.CAPTURED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot swap an order that has not been captured"
        )
      }

      if (order.fulfillment_status === FulfillmentStatus.NOT_FULFILLED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot swap an order that has not been fulfilled"
        )
      }

      const areReturnItemsValid = await this.areReturnItemsValid(returnItems)

      if (!areReturnItemsValid) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot create a swap on a canceled item.`
        )
      }

      let newItems: LineItem[] = []

      if (additionalItems) {
        newItems = await Promise.all(
          additionalItems.map(async ({ variant_id, quantity }) => {
            if (variant_id === null) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "You must include a variant when creating additional items on a swap"
              )
            }
            return this.lineItemService_.withTransaction(manager).generate(
              { variantId: variant_id, quantity },
              {
                region_id: order.region_id,
                cart: order.cart,
              }
            )
          })
        )
      }

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const created = swapRepo.create({
        ...rest,
        fulfillment_status: SwapFulfillmentStatus.NOT_FULFILLED,
        payment_status: SwapPaymentStatus.NOT_PAID,
        order_id: order.id,
        additional_items: newItems,
        no_notification: evaluatedNoNotification,
      })

      const result = await swapRepo.save(created)

      await this.returnService_.withTransaction(manager).create({
        swap_id: result.id,
        order_id: order.id,
        items: returnItems as OrdersReturnItem[],
        shipping_method: returnShipping,
        no_notification: evaluatedNoNotification,
      })

      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.CREATED, {
          id: result.id,
          no_notification: evaluatedNoNotification,
        })

      return result
    })
  }

  /**
   * Process difference for the requested swap.
   *
   * @param swapId id of a swap being processed
   * @return processed swap
   */
  async processDifference(swapId: string): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swap = await this.retrieve(swapId, {
        relations: ["payment", "order", "order.payments"],
      })

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled swap cannot be processed"
        )
      }

      if (!swap.confirmed_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot process a swap that hasn't been confirmed by the customer"
        )
      }

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      if (swap.difference_due < 0) {
        if (swap.payment_status === "difference_refunded") {
          return swap
        }

        try {
          await this.paymentProviderService_
            .withTransaction(manager)
            .refundPayment(
              swap.order.payments,
              -1 * swap.difference_due,
              "swap"
            )
        } catch (err) {
          swap.payment_status = SwapPaymentStatus.REQUIRES_ACTION
          const result = await swapRepo.save(swap)

          await this.eventBus_
            .withTransaction(manager)
            .emit(SwapService.Events.PROCESS_REFUND_FAILED, {
              id: result.id,
              no_notification: swap.no_notification,
            })

          return result
        }

        swap.payment_status = SwapPaymentStatus.DIFFERENCE_REFUNDED

        const result = await swapRepo.save(swap)

        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.REFUND_PROCESSED, {
            id: result.id,
            no_notification: swap.no_notification,
          })

        return result
      } else if (swap.difference_due === 0) {
        if (swap.payment_status === SwapPaymentStatus.DIFFERENCE_REFUNDED) {
          return swap
        }

        swap.payment_status = SwapPaymentStatus.DIFFERENCE_REFUNDED

        const result = await swapRepo.save(swap)

        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.REFUND_PROCESSED, {
            id: result.id,
            no_notification: swap.no_notification,
          })

        return result
      }

      try {
        if (swap.payment_status === SwapPaymentStatus.CAPTURED) {
          return swap
        }

        await this.paymentProviderService_
          .withTransaction(manager)
          .capturePayment(swap.payment)
      } catch (err) {
        swap.payment_status = SwapPaymentStatus.REQUIRES_ACTION
        const result = await swapRepo.save(swap)

        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.PAYMENT_CAPTURE_FAILED, {
            id: swap.id,
            no_notification: swap.no_notification,
          })

        return result
      }

      swap.payment_status = SwapPaymentStatus.CAPTURED

      const result = await swapRepo.save(swap)

      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.PAYMENT_CAPTURED, {
          id: result.id,
          no_notification: swap.no_notification,
        })

      return result
    })
  }

  /**
   * Update the swap record.
   *
   * @param swapId id of a swap to update
   * @param update new data
   * @return updated swap record
   */
  async update(swapId: string, update: Partial<Swap>): Promise<Swap> {
    return await this.atomicPhase_(async (manager) => {
      const swap = await this.retrieve(swapId)

      if ("metadata" in update) {
        swap.metadata = setMetadata(swap, update.metadata!)
      }

      if ("no_notification" in update) {
        swap.no_notification = update.no_notification!
      }

      if ("shipping_address" in update) {
        // TODO: Check this - calling method that doesn't exist
        // also it seems that update swap isn't call anywhere
        // await this.updateShippingAddress_(swap, update.shipping_address)
      }

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      return await swapRepo.save(swap)
    })
  }

  /**
   * Creates a cart from the given swap. The cart can be used to pay
   * for differences associated with the swap. The swap represented by the
   * swapId must belong to the order. Fails if there is already a cart on the
   * swap.
   *
   * @param swapId - the id of the swap to create the cart from
   * @param customShippingOptions - the shipping options
   * @return the swap with its cart_id prop set to the id of the new cart.
   */
  async createCart(
    swapId: string,
    customShippingOptions: { option_id: string; price: number }[] = []
  ): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swapRepo = manager.getCustomRepository(this.swapRepository_)

      const swap = await this.retrieve(swapId, {
        relations: [
          "order",
          "order.items",
          "order.swaps",
          "order.swaps.additional_items",
          "order.discounts",
          "order.discounts.rule",
          "order.claims",
          "order.claims.additional_items",
          "additional_items",
          "additional_items.variant",
          "return_order",
          "return_order.items",
          "return_order.shipping_method",
          "return_order.shipping_method.tax_lines",
        ],
      })

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled swap cannot be used to create a cart"
        )
      }

      if (swap.cart_id) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A cart has already been created for the swap"
        )
      }

      const order = swap.order

      // filter out free shipping discounts
      const discounts =
        order?.discounts?.filter(({ rule }) => rule.type !== "free_shipping") ||
        undefined

      let cart = await this.cartService_.withTransaction(manager).create({
        discounts,
        email: order.email,
        billing_address_id: order.billing_address_id,
        shipping_address_id: order.shipping_address_id,
        region_id: order.region_id,
        customer_id: order.customer_id,
        type: CartType.SWAP,
        metadata: {
          swap_id: swap.id,
          parent_order_id: order.id,
        },
      })

      const customShippingOptionServiceTx =
        this.customShippingOptionService_.withTransaction(manager)
      for (const customShippingOption of customShippingOptions) {
        await customShippingOptionServiceTx.create({
          cart_id: cart.id,
          shipping_option_id: customShippingOption.option_id,
          price: customShippingOption.price,
        })
      }

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)
      const lineItemAdjustmentServiceTx =
        this.lineItemAdjustmentService_.withTransaction(manager)

      await Promise.all(
        swap.additional_items.map(
          async (item) =>
            await lineItemServiceTx.update(item.id, {
              cart_id: cart.id,
            })
        )
      )

      cart = await this.cartService_
        .withTransaction(manager)
        .retrieve(cart.id, {
          relations: ["items", "region", "discounts", "discounts.rule"],
        })

      await Promise.all(
        cart.items.map(async (item) => {
          // we generate adjustments in case the cart has any discounts that should be applied to the additional items
          await lineItemAdjustmentServiceTx.createAdjustmentForLineItem(
            cart,
            item
          )
        })
      )

      // If the swap has a return shipping method the price has to be added to
      // the cart.
      if (swap.return_order && swap.return_order.shipping_method) {
        await this.lineItemService_.withTransaction(manager).create({
          cart_id: cart.id,
          title: "Return shipping",
          quantity: 1,
          has_shipping: true,
          allow_discounts: false,
          unit_price: swap.return_order.shipping_method.price,
          is_return: true,
          tax_lines: swap.return_order.shipping_method.tax_lines.map((tl) => {
            return lineItemServiceTx.createTaxLine({
              name: tl.name,
              code: tl.code,
              rate: tl.rate,
              metadata: tl.metadata,
            })
          }),
        })
      }

      await this.lineItemService_
        .withTransaction(manager)
        .createReturnLines(swap.return_order.id, cart.id)

      swap.cart_id = cart.id

      return await swapRepo.save(swap)
    })
  }

  /**
   * Register a cart completion
   *
   * @param swapId - The id of the swap
   * @return swap related to the cart
   */
  async registerCartCompletion(swapId: string): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swap = await this.retrieve(swapId, {
        select: [
          "id",
          "order_id",
          "no_notification",
          "allow_backorder",
          "canceled_at",
          "confirmed_at",
          "cart_id",
        ],
      })

      // If we already registered the cart completion we just return
      if (swap.confirmed_at) {
        return swap
      }

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cart related to canceled swap cannot be completed"
        )
      }

      const cart = await this.cartService_
        .withTransaction(manager)
        .retrieveWithTotals(swap.cart_id, {
          relations: ["payment"],
        })

      const { payment } = cart

      const items = cart.items

      const total = cart.total!

      if (total > 0) {
        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment"
          )
        }

        const paymentStatus = await this.paymentProviderService_
          .withTransaction(manager)
          .getStatus(payment)

        // If payment status is not authorized, we throw
        if (
          paymentStatus !== PaymentSessionStatus.AUTHORIZED &&
          // @ts-ignore TODO: check why this is not in the enum
          paymentStatus !== "succeeded"
        ) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }

        await this.paymentProviderService_
          .withTransaction(manager)
          .updatePayment(payment.id, {
            swap_id: swapId,
            order_id: swap.order_id,
          })

        await Promise.all(
          items.map(async (item) => {
            if (item.variant_id) {
              await this.productVariantInventoryService_.reserveQuantity(
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
      }

      swap.difference_due = total
      swap.shipping_address_id = cart.shipping_address_id
      // TODO: Due to cascade insert we have to remove the tax_lines that have been added by the cart decorate totals.
      // Is the cascade insert really used? Also, is it really necessary to pass the entire entities when creating or updating?
      // We normally should only pass what is needed?
      swap.shipping_methods = cart.shipping_methods.map((method) => {
        ;(method.tax_lines as any) = undefined
        return method
      })
      swap.confirmed_at = new Date()
      swap.payment_status =
        total === 0 ? SwapPaymentStatus.CONFIRMED : SwapPaymentStatus.AWAITING

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const result = await swapRepo.save(swap)

      const shippingOptionServiceTx =
        this.shippingOptionService_.withTransaction(manager)

      for (const method of cart.shipping_methods) {
        await shippingOptionServiceTx.updateShippingMethod(method.id, {
          swap_id: result.id,
        })
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.PAYMENT_COMPLETED, {
          id: swap.id,
          no_notification: swap.no_notification,
        })

      await this.cartService_
        .withTransaction(manager)
        .update(cart.id, { completed_at: new Date() })

      return result
    })
  }

  /**
   * Cancels a given swap if possible. A swap can only be canceled if all
   * related returns, fulfillments, and payments have been canceled. If a swap
   * is associated with a refund, it cannot be canceled.
   *
   * @param swapId - the id of the swap to cancel.
   * @return the canceled swap.
   */
  async cancel(swapId: string): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swapRepo = manager.getCustomRepository(this.swapRepository_)

      const swap = await this.retrieve(swapId, {
        relations: ["payment", "fulfillments", "return_order"],
      })

      if (
        swap.payment_status === SwapPaymentStatus.DIFFERENCE_REFUNDED ||
        swap.payment_status === SwapPaymentStatus.PARTIALLY_REFUNDED ||
        swap.payment_status === SwapPaymentStatus.REFUNDED
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Swap with a refund cannot be canceled"
        )
      }

      if (swap.fulfillments) {
        for (const f of swap.fulfillments) {
          if (!f.canceled_at) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "All fulfillments must be canceled before the swap can be canceled"
            )
          }
        }
      }

      if (
        swap.return_order &&
        swap.return_order.status !== ReturnStatus.CANCELED
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Return must be canceled before the swap can be canceled"
        )
      }

      swap.payment_status = SwapPaymentStatus.CANCELED
      swap.fulfillment_status = SwapFulfillmentStatus.CANCELED
      swap.canceled_at = new Date()

      if (swap.payment) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .cancelPayment(swap.payment)
      }

      return await swapRepo.save(swap)
    })
  }

  /**
   * Fulfills the additional items associated with the swap. Will call the
   * fulfillment providers associated with the shipping methods.
   *
   * @param {string} swapId - the id of the swap to fulfill,
   * @param {object} config - optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag.
   * @return {Promise<Swap>} the updated swap with new status and fulfillments.
   */
  async createFulfillment(
    swapId: string,
    config: CreateShipmentConfig = {
      metadata: {},
      no_notification: undefined,
    }
  ): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const { metadata, no_notification } = config
      const swapRepo = manager.getCustomRepository(this.swapRepository_)

      const swap = await this.retrieve(swapId, {
        relations: [
          "payment",
          "shipping_address",
          "additional_items",
          "additional_items.tax_lines",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "order",
          "order.region",
          "order.billing_address",
          "order.discounts",
          "order.discounts.rule",
          "order.payments",
        ],
      })
      const order = swap.order

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled swap cannot be fulfilled"
        )
      }

      if (
        swap.fulfillment_status !== "not_fulfilled" &&
        swap.fulfillment_status !== "canceled"
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "The swap was already fulfilled"
        )
      }

      if (!swap.shipping_methods?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot fulfill an swap that doesn't have shipping methods"
        )
      }

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : swap.no_notification

      swap.fulfillments = await this.fulfillmentService_
        .withTransaction(manager)
        .createFulfillment(
          // @ts-ignore TODO: check - claim_items,refund_amount,type: these fields are missing
          {
            ...swap,
            payments: swap.payment ? [swap.payment] : order.payments,
            email: order.email,
            discounts: order.discounts,
            currency_code: order.currency_code,
            tax_rate: order.tax_rate,
            region_id: order.region_id,
            region: order.region,
            display_id: order.display_id,
            billing_address: order.billing_address,
            items: swap.additional_items,
            shipping_methods: swap.shipping_methods,
            is_swap: true,
            no_notification: evaluatedNoNotification,
          },
          swap.additional_items.map((i) => ({
            item_id: i.id,
            quantity: i.quantity,
          })),
          { swap_id: swapId, metadata }
        )

      let successfullyFulfilled: FulfillmentItem[] = []
      for (const f of swap.fulfillments) {
        successfullyFulfilled = successfullyFulfilled.concat(f.items)
      }

      swap.fulfillment_status = SwapFulfillmentStatus.FULFILLED

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

      // Update all line items to reflect fulfillment
      for (const item of swap.additional_items) {
        const fulfillmentItem = successfullyFulfilled.find(
          (f) => item.id === f.item_id
        )

        if (fulfillmentItem) {
          const fulfilledQuantity =
            (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

          // Update the fulfilled quantity
          await lineItemServiceTx.update(item.id, {
            fulfilled_quantity: fulfilledQuantity,
          })

          if (item.quantity !== fulfilledQuantity) {
            swap.fulfillment_status = SwapFulfillmentStatus.REQUIRES_ACTION
          }
        } else {
          if (item.quantity !== item.fulfilled_quantity) {
            swap.fulfillment_status = SwapFulfillmentStatus.REQUIRES_ACTION
          }
        }
      }

      const result = await swapRepo.save(swap)

      await this.eventBus_.withTransaction(manager).emit(
        SwapService.Events.FULFILLMENT_CREATED,

        {
          id: swapId,
          fulfillment_id: result.id,
          no_notification: evaluatedNoNotification,
        }
      )

      return result
    })
  }

  /**
   * Cancels a fulfillment (if related to a swap)
   *
   * @param fulfillmentId - the ID of the fulfillment to cancel
   * @return updated swap
   */
  async cancelFulfillment(fulfillmentId: string): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const canceled = await this.fulfillmentService_
        .withTransaction(manager)
        .cancelFulfillment(fulfillmentId)

      if (!canceled.swap_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Fufillment not related to a swap`
        )
      }

      const swap = await this.retrieve(canceled.swap_id)

      swap.fulfillment_status = SwapFulfillmentStatus.CANCELED

      return await swapRepo.save(swap)
    })
  }

  /**
   * Marks a fulfillment as shipped and attaches tracking numbers.
   *
   * @param swapId - the id of the swap that has been shipped.
   * @param fulfillmentId - the id of the specific fulfillment that has been shipped
   * @param trackingLinks - the tracking numbers associated with the shipment
   * @param config - optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag.
   * @return the updated swap with new fulfillments and status.
   */
  async createShipment(
    swapId: string,
    fulfillmentId: string,
    trackingLinks?: { tracking_number: string }[],
    config: CreateShipmentConfig = {
      metadata: {},
      no_notification: undefined,
    }
  ): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const { metadata, no_notification } = config
      const swapRepo = manager.getCustomRepository(this.swapRepository_)

      const swap = await this.retrieve(swapId, {
        relations: ["additional_items"],
      })

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled swap cannot be fulfilled as shipped"
        )
      }
      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : swap.no_notification

      // Update the fulfillment to register
      const shipment = await this.fulfillmentService_
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingLinks, {
          metadata,
          no_notification: evaluatedNoNotification,
        })

      swap.fulfillment_status = SwapFulfillmentStatus.SHIPPED

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

      // Go through all the additional items in the swap
      for (const i of swap.additional_items) {
        const shipped = shipment.items.find((si) => si.item_id === i.id)
        if (shipped) {
          const shippedQty = (i.shipped_quantity || 0) + shipped.quantity
          await lineItemServiceTx.update(i.id, {
            shipped_quantity: shippedQty,
          })

          if (shippedQty !== i.quantity) {
            swap.fulfillment_status = SwapFulfillmentStatus.PARTIALLY_SHIPPED
          }
        } else {
          if (i.shipped_quantity !== i.quantity) {
            swap.fulfillment_status = SwapFulfillmentStatus.PARTIALLY_SHIPPED
          }
        }
      }

      const result = await swapRepo.save(swap)

      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.SHIPMENT_CREATED, {
          id: swapId,
          fulfillment_id: shipment.id,
          no_notification: swap.no_notification,
        })

      return result
    })
  }

  /**
   * Dedicated method to delete metadata for a swap.
   *
   * @param swapId - the order to delete metadata from.
   * @param key - key for metadata field
   * @return resolves to the updated result.
   */
  async deleteMetadata(swapId: string, key: string): Promise<Swap | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const validatedId = validateId(swapId)

        const swapRepo = transactionManager.getCustomRepository(
          this.swapRepository_
        )

        const swap = await swapRepo.findOne(validatedId)

        if (!swap) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Swap with id: ${validatedId} was not found`
          )
        }

        const updated = swap.metadata || {}
        delete updated[key]
        swap.metadata = updated

        const updatedSwap = await swapRepo.save(swap)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedSwap)

        return updatedSwap
      }
    )
  }

  /**
   * Registers the swap return items as received so that they cannot be used
   * as a part of other swaps/returns.
   *
   * @param id - the id of the order with the swap.
   * @return the resulting order
   */
  async registerReceived(id): Promise<Swap | never> {
    return await this.atomicPhase_(async (manager) => {
      const swap = await this.retrieve(id, {
        relations: ["return_order", "return_order.items"],
      })

      if (swap.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled swap cannot be registered as received"
        )
      }

      if (swap.return_order.status !== "received") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Swap is not received"
        )
      }

      const result = await this.retrieve(id)

      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.RECEIVED, {
          id: id,
          order_id: result.order_id,
          no_notification: swap.no_notification,
        })

      return result
    })
  }

  protected async areReturnItemsValid(
    returnItems: WithRequiredProperty<Partial<ReturnItem>, "item_id">[]
  ): Promise<boolean> {
    const manager = this.transactionManager_ ?? this.manager_

    const returnItemsEntities = await this.lineItemService_
      .withTransaction(manager)
      .list(
        {
          id: In(returnItems.map((r) => r.item_id)),
        },
        {
          relations: ["order", "swap", "claim_order"],
        }
      )

    const hasCanceledItem = returnItemsEntities.some((item) => {
      return (
        item.order?.canceled_at ||
        item.swap?.canceled_at ||
        item.claim_order?.canceled_at
      )
    })

    return !hasCanceledItem
  }
}

export default SwapService
