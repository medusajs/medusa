import { IInventoryService } from "@medusajs/types"
import { isDefined, MedusaError, TransactionBaseService } from "@medusajs/utils"
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  Raw,
} from "typeorm"
import {
  CartService,
  CustomerService,
  DiscountService,
  DraftOrderService,
  FulfillmentProviderService,
  FulfillmentService,
  GiftCardService,
  LineItemService,
  NewTotalsService,
  PaymentProviderService,
  ProductVariantInventoryService,
  RegionService,
  ShippingOptionService,
  ShippingProfileService,
  TaxProviderService,
  TotalsService,
} from "."
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"
import {
  Address,
  Cart,
  ClaimOrder,
  Fulfillment,
  FulfillmentItem,
  FulfillmentStatus,
  GiftCard,
  LineItem,
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  Return,
  Swap,
  TrackingLink,
} from "../models"
import { AddressRepository } from "../repositories/address"
import { OrderRepository } from "../repositories/order"
import { FindConfig, QuerySelector, Selector } from "../types/common"
import {
  CreateFulfillmentOrder,
  FulFillmentItemType,
} from "../types/fulfillment"
import { TotalsContext, UpdateOrderInput } from "../types/orders"
import { CreateShippingMethodDto } from "../types/shipping-options"
import {
  buildQuery,
  buildRelations,
  buildSelects,
  isString,
  setMetadata,
} from "../utils"
import { FlagRouter } from "../utils/flag-router"
import EventBusService from "./event-bus"

export const ORDER_CART_ALREADY_EXISTS_ERROR = "Order from cart already exists"

type InjectedDependencies = {
  manager: EntityManager
  orderRepository: typeof OrderRepository
  customerService: CustomerService
  paymentProviderService: PaymentProviderService
  shippingOptionService: ShippingOptionService
  shippingProfileService: ShippingProfileService
  discountService: DiscountService
  fulfillmentProviderService: FulfillmentProviderService
  fulfillmentService: FulfillmentService
  lineItemService: LineItemService
  totalsService: TotalsService
  newTotalsService: NewTotalsService
  taxProviderService: TaxProviderService
  regionService: RegionService
  cartService: CartService
  addressRepository: typeof AddressRepository
  giftCardService: GiftCardService
  draftOrderService: DraftOrderService
  inventoryService: IInventoryService
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
  productVariantInventoryService: ProductVariantInventoryService
}

class OrderService extends TransactionBaseService {
  static readonly Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
    SHIPMENT_CREATED: "order.shipment_created",
    FULFILLMENT_CREATED: "order.fulfillment_created",
    FULFILLMENT_CANCELED: "order.fulfillment_canceled",
    RETURN_REQUESTED: "order.return_requested",
    ITEMS_RETURNED: "order.items_returned",
    RETURN_ACTION_REQUIRED: "order.return_action_required",
    REFUND_CREATED: "order.refund_created",
    REFUND_FAILED: "order.refund_failed",
    SWAP_CREATED: "order.swap_created",
    PLACED: "order.placed",
    UPDATED: "order.updated",
    CANCELED: "order.canceled",
    COMPLETED: "order.completed",
  }

  protected readonly orderRepository_: typeof OrderRepository
  protected readonly customerService_: CustomerService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly shippingProfileService_: ShippingProfileService
  protected readonly discountService_: DiscountService
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly fulfillmentService_: FulfillmentService
  protected readonly lineItemService_: LineItemService
  protected readonly totalsService_: TotalsService
  protected readonly newTotalsService_: NewTotalsService
  protected readonly taxProviderService_: TaxProviderService
  protected readonly regionService_: RegionService
  protected readonly cartService_: CartService
  protected readonly addressRepository_: typeof AddressRepository
  protected readonly giftCardService_: GiftCardService
  protected readonly draftOrderService_: DraftOrderService
  protected readonly inventoryService_: IInventoryService
  protected readonly eventBus_: EventBusService
  protected readonly featureFlagRouter_: FlagRouter
  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService

  constructor({
    orderRepository,
    customerService,
    paymentProviderService,
    shippingOptionService,
    shippingProfileService,
    discountService,
    fulfillmentProviderService,
    fulfillmentService,
    lineItemService,
    totalsService,
    newTotalsService,
    taxProviderService,
    regionService,
    cartService,
    addressRepository,
    giftCardService,
    draftOrderService,
    eventBusService,
    featureFlagRouter,
    productVariantInventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.orderRepository_ = orderRepository
    this.customerService_ = customerService
    this.paymentProviderService_ = paymentProviderService
    this.shippingProfileService_ = shippingProfileService
    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.lineItemService_ = lineItemService
    this.totalsService_ = totalsService
    this.newTotalsService_ = newTotalsService
    this.taxProviderService_ = taxProviderService
    this.regionService_ = regionService
    this.fulfillmentService_ = fulfillmentService
    this.discountService_ = discountService
    this.giftCardService_ = giftCardService
    this.eventBus_ = eventBusService
    this.shippingOptionService_ = shippingOptionService
    this.cartService_ = cartService
    this.addressRepository_ = addressRepository
    this.draftOrderService_ = draftOrderService
    this.featureFlagRouter_ = featureFlagRouter
    this.productVariantInventoryService_ = productVariantInventoryService
  }

  /**
   * @param selector the query object for find
   * @param config the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<Order[]> {
    const [orders] = await this.listAndCount(selector, config)
    return orders
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: QuerySelector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<[Order[], number]> {
    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    let q
    if (selector.q) {
      q = selector.q
      delete selector.q

      config.relations = config.relations
        ? Array.from(
            new Set([...config.relations, "shipping_address", "customer"])
          )
        : ["shipping_address", "customer"]
    }

    const query = buildQuery(selector, config) as FindManyOptions<Order>

    if (q) {
      const where = query.where as FindOptionsWhere<Order>

      delete where.display_id
      delete where.email

      // Inner join like constraints
      const innerJoinLikeConstraints = {
        customer: {
          id: Not(IsNull()),
        },
        shipping_address: {
          id: Not(IsNull()),
        },
      }

      query.where = [
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          shipping_address: {
            ...innerJoinLikeConstraints.shipping_address,
            id: Not(IsNull()),
            first_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          email: ILike(`%${q}%`),
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          display_id: Raw((alias) => `CAST(${alias} as varchar) ILike :q`, {
            q: `%${q}%`,
          }),
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            first_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            last_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            phone: ILike(`%${q}%`),
          },
        },
      ]
    }

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    query.select = buildSelects(select || [])
    const rels = buildRelations(this.getTotalsRelations({ relations }))

    delete query.relations

    const raw = await orderRepo.findWithRelations(rels, query)
    const count = await orderRepo.count(query)
    const orders = await Promise.all(
      raw.map(async (r) => await this.decorateTotals(r, totalsToSelect))
    )

    return [orders, count]
  }

  protected transformQueryForTotals(config: FindConfig<Order>): {
    relations: string[] | undefined
    select: FindConfig<Order>["select"]
    totalsToSelect: FindConfig<Order>["select"]
  } {
    let { select, relations } = config

    if (!select) {
      return {
        select,
        relations,
        totalsToSelect: [],
      }
    }

    const totalFields = [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "gift_card_total",
      "total",
      "paid_total",
      "refunded_total",
      "refundable_amount",
      "items.refundable",
      "swaps.additional_items.refundable",
      "claims.additional_items.refundable",
    ]

    const totalsToSelect = select.filter((v) => totalFields.includes(v))
    if (totalsToSelect.length > 0) {
      const relationSet = new Set(relations)
      relationSet.add("items")
      relationSet.add("items.tax_lines")
      relationSet.add("items.adjustments")
      relationSet.add("items.variant")
      relationSet.add("items.variant.product")
      relationSet.add("swaps")
      relationSet.add("swaps.additional_items")
      relationSet.add("swaps.additional_items.tax_lines")
      relationSet.add("swaps.additional_items.adjustments")
      relationSet.add("claims")
      relationSet.add("claims.additional_items")
      relationSet.add("claims.additional_items.tax_lines")
      relationSet.add("claims.additional_items.adjustments")
      relationSet.add("discounts")
      relationSet.add("discounts.rule")
      relationSet.add("gift_cards")
      relationSet.add("gift_card_transactions")
      relationSet.add("gift_card_transactions.gift_card")
      relationSet.add("refunds")
      relationSet.add("shipping_methods")
      relationSet.add("shipping_methods.tax_lines")
      relationSet.add("region")
      relations = [...relationSet]

      select = select.filter((v) => !totalFields.includes(v))
    }

    const toSelect = [...select]
    if (toSelect.length > 0 && toSelect.indexOf("tax_rate") === -1) {
      toSelect.push("tax_rate")
    }

    return {
      relations,
      select: toSelect.length ? toSelect : undefined,
      totalsToSelect,
    }
  }

  /**
   * Gets an order by id.
   * @param orderId - id or selector of order to retrieve
   * @param config - config of order to retrieve
   * @return the order document
   */
  async retrieve(
    orderId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    if (!isDefined(orderId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"orderId" must be defined`
      )
    }

    const { totalsToSelect } = this.transformQueryForTotals(config)

    if (totalsToSelect?.length) {
      return await this.retrieveLegacy(orderId, config)
    }

    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    const query = buildQuery({ id: orderId }, config)

    if (!(config.select || []).length) {
      query.select = undefined
    }

    const queryRelations = { ...query.relations }
    delete query.relations

    const raw = await orderRepo.findOneWithRelations(queryRelations, query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with id ${orderId} was not found`
      )
    }

    return raw
  }

  protected async retrieveLegacy(
    orderIdOrSelector: string | Selector<Order>,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    const selector = isString(orderIdOrSelector)
      ? { id: orderIdOrSelector }
      : orderIdOrSelector

    const query = buildQuery(selector, config)

    if (relations && relations.length > 0) {
      query.relations = buildRelations(relations)
    }

    query.select = select?.length ? buildSelects(select) : undefined

    const rels = query.relations
    delete query.relations

    const raw = await orderRepo.findOneWithRelations(rels, query)

    if (!raw) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ${selectorConstraints} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
  }

  async retrieveWithTotals(
    orderId: string,
    options: FindConfig<Order> = {},
    context: TotalsContext = {}
  ): Promise<Order> {
    const relations = this.getTotalsRelations(options)
    const order = await this.retrieve(orderId, { ...options, relations })

    return await this.decorateTotals(order, context)
  }

  /**
   * Gets an order by cart id.
   * @param cartId - cart id to find order
   * @param config - the config to be used to find order
   * @return the order document
   */
  async retrieveByCartId(
    cartId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    if (!isDefined(cartId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"cartId" must be defined`
      )
    }

    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    const query = buildQuery({ cart_id: cartId }, config)

    if (!(config.select || []).length) {
      query.select = undefined
    }

    const queryRelations = { ...query.relations }
    delete query.relations

    const raw = await orderRepo.findOneWithRelations(queryRelations, query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with cart id ${cartId} was not found`
      )
    }

    return raw
  }

  async retrieveByCartIdWithTotals(
    cartId: string,
    options: FindConfig<Order> = {}
  ): Promise<Order> {
    const relations = this.getTotalsRelations(options)
    const order = await this.retrieveByCartId(cartId, { ...options, relations })
    return await this.decorateTotals(order, {})
  }

  /**
   * Gets an order by id.
   * @param externalId - id of order to retrieve
   * @param config - query config to get order by
   * @return the order document
   */
  async retrieveByExternalId(
    externalId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    const selector = {
      where: { external_id: externalId },
    }

    let queryRelations
    if (relations && relations.length > 0) {
      queryRelations = relations
    }
    queryRelations = this.getTotalsRelations({ relations: queryRelations })

    const querySelect = select?.length ? select : undefined

    const query = buildQuery(selector, {
      select: querySelect,
      relations: queryRelations,
    } as FindConfig<Order>)

    const rels = { ...query.relations }
    delete query.relations

    const raw = await orderRepo.findOneWithRelations(rels, query)
    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with external id ${externalId} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
  }

  /**
   * @param orderId - id of the order to complete
   * @return the result of the find operation
   */
  async completeOrder(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be completed"
        )
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.COMPLETED, {
          id: orderId,
          no_notification: order.no_notification,
        })

      order.status = OrderStatus.COMPLETED

      const orderRepo = manager.withRepository(this.orderRepository_)
      return orderRepo.save(order)
    })
  }

  /**
   * Creates an order from a cart
   * @return resolves to the creation result.
   * @param cartOrId
   */
  async createFromCart(cartOrId: string | Cart): Promise<Order | never> {
    return await this.atomicPhase_(async (manager) => {
      const cartServiceTx = this.cartService_.withTransaction(manager)

      const exists = !!(await this.retrieveByCartId(
        isString(cartOrId) ? cartOrId : cartOrId?.id,
        {
          select: ["id"],
        }
      ).catch(() => void 0))

      if (exists) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          ORDER_CART_ALREADY_EXISTS_ERROR
        )
      }

      const cart = isString(cartOrId)
        ? await cartServiceTx.retrieveWithTotals(cartOrId, {
            relations: ["region", "payment", "items"],
          })
        : cartOrId

      if (cart.items.length === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot create order from empty cart"
        )
      }

      const { payment, region, total } = cart

      // Would be the case if a discount code is applied that covers the item
      // total
      if (total !== 0) {
        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment method"
          )
        }

        const paymentStatus = await this.paymentProviderService_
          .withTransaction(manager)
          .getStatus(payment)

        if (paymentStatus !== "authorized") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }
      }

      const orderRepo = manager.withRepository(this.orderRepository_)

      // TODO: Due to cascade insert we have to remove the tax_lines that have been added by the cart decorate totals.
      // Is the cascade insert really used? Also, is it really necessary to pass the entire entities when creating or updating?
      // We normally should only pass what is needed?
      const shippingMethods = cart.shipping_methods.map((method) => {
        (method.tax_lines as any) = undefined
        return method
      })

      const toCreate = {
        payment_status: "awaiting",
        discounts: cart.discounts,
        gift_cards: cart.gift_cards,
        shipping_methods: shippingMethods,
        shipping_address_id: cart.shipping_address_id,
        billing_address_id: cart.billing_address_id,
        region_id: cart.region_id,
        email: cart.email,
        customer_id: cart.customer_id,
        cart_id: cart.id,
        currency_code: region.currency_code,
        metadata: cart.metadata || {},
      } as Partial<Order>

      if (
        cart.sales_channel_id &&
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        toCreate.sales_channel_id = cart.sales_channel_id
      }

      if (cart.type === "draft_order") {
        const draft = await this.draftOrderService_
          .withTransaction(manager)
          .retrieveByCartId(cart.id)

        toCreate.draft_order_id = draft.id
        toCreate.no_notification = draft.no_notification_order
      }

      const rawOrder = orderRepo.create(toCreate)
      const order = await orderRepo.save(rawOrder)

      if (total !== 0 && payment) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .updatePayment(payment.id, {
            order_id: order.id,
          })
      }

      if (!isDefined(cart.subtotal) || !isDefined(cart.discount_total)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Unable to compute gift cardable amount during order creation from cart. The cart is missing the subtotal and/or discount_total"
        )
      }

      const giftCardableAmount =
        (cart.region?.gift_cards_taxable
          ? cart.subtotal! - cart.discount_total!
          : cart.total! + cart.gift_card_total!) || 0 // we re add the gift card total to compensate the fact that the decorate total already removed this amount from the total

      let giftCardableAmountBalance = giftCardableAmount
      const giftCardService = this.giftCardService_.withTransaction(manager)

      for (const giftCard of cart.gift_cards) {
        const newGiftCardBalance = Math.max(
          0,
          giftCard.balance - giftCardableAmountBalance
        )
        const giftCardBalanceUsed = giftCard.balance - newGiftCardBalance

        await giftCardService.update(giftCard.id, {
          balance: newGiftCardBalance,
          is_disabled: newGiftCardBalance === 0,
        })

        await giftCardService.createTransaction({
          gift_card_id: giftCard.id,
          order_id: order.id,
          amount: giftCardBalanceUsed,
          is_taxable: !!giftCard.tax_rate,
          tax_rate: giftCard.tax_rate,
        })

        giftCardableAmountBalance =
          giftCardableAmountBalance - giftCardBalanceUsed
      }

      const shippingOptionServiceTx =
        this.shippingOptionService_.withTransaction(manager)
      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

      await Promise.all(
        [
          cart.items.map((lineItem): unknown[] => {
            const toReturn: unknown[] = [
              lineItemServiceTx.update(lineItem.id, { order_id: order.id }),
            ]

            if (lineItem.is_giftcard) {
              toReturn.push(
                this.createGiftCardsFromLineItem_(order, lineItem, manager)
              )
            }

            return toReturn
          }),
          cart.shipping_methods.map(async (method) => {
            // TODO: Due to cascade insert we have to remove the tax_lines that have been added by the cart decorate totals.
            // Is the cascade insert really used? Also, is it really necessary to pass the entire entities when creating or updating?
            // We normally should only pass what is needed?
            (method.tax_lines as any) = undefined
            return shippingOptionServiceTx.updateShippingMethod(method.id, {
              order_id: order.id,
            })
          }),
        ].flat(Infinity)
      )

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.PLACED, {
          id: order.id,
          no_notification: order.no_notification,
        })

      await cartServiceTx.update(cart.id, { completed_at: new Date() })

      return order
    })
  }

  protected createGiftCardsFromLineItem_(
    order: Order,
    lineItem: LineItem,
    manager: EntityManager
  ): Promise<GiftCard>[] {
    const createGiftCardPromises: Promise<GiftCard>[] = []

    // LineItem type doesn't promise either the subtotal or quantity. Adding a check here provides
    // additional type safety/strictness
    if (!lineItem.subtotal || !lineItem.quantity) {
      return createGiftCardPromises
    }

    // Subtotal is the pure value of the product/variant excluding tax, discounts, etc.
    // We divide here by quantity to get the value of the product/variant as a lineItem
    // contains quantity. The subtotal is multiplicative of pure price per product and quantity
    const taxExclusivePrice = lineItem.subtotal / lineItem.quantity
    // The tax_lines contains all the taxes that is applicable on the purchase of the gift card
    // On utilizing the gift card, the same set of taxRate will apply to gift card
    // We calculate the summation of all taxes and add that as a snapshot in the giftcard.tax_rate column
    const giftCardTaxRate = lineItem.tax_lines.reduce(
      (sum, taxLine) => sum + taxLine.rate,
      0
    )

    const giftCardTxnService = this.giftCardService_.withTransaction(manager)

    for (let qty = 0; qty < lineItem.quantity; qty++) {
      const createGiftCardPromise = giftCardTxnService.create({
        region_id: order.region_id,
        order_id: order.id,
        value: taxExclusivePrice,
        balance: taxExclusivePrice,
        metadata: lineItem.metadata,
        tax_rate: giftCardTaxRate || null,
      })

      createGiftCardPromises.push(createGiftCardPromise)
    }

    return createGiftCardPromises
  }

  /**
   * Adds a shipment to the order to indicate that an order has left the
   * warehouse. Will ask the fulfillment provider for any documents that may
   * have been created in regards to the shipment.
   * @param orderId - the id of the order that has been shipped
   * @param fulfillmentId - the fulfillment that has now been shipped
   * @param trackingLinks - array of tracking numebers
   *   associated with the shipment
   * @param config - the config of the order that has been shipped
   * @return the resulting order following the update.
   */
  async createShipment(
    orderId: string,
    fulfillmentId: string,
    trackingLinks?: TrackingLink[],
    config: {
      no_notification?: boolean
      metadata: Record<string, unknown>
    } = {
      metadata: {},
      no_notification: undefined,
    }
  ): Promise<Order> {
    const { metadata, no_notification } = config

    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, { relations: ["items"] })
      const shipment = await this.fulfillmentService_
        .withTransaction(manager)
        .retrieve(fulfillmentId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be fulfilled as shipped"
        )
      }

      if (!shipment || shipment.order_id !== orderId) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          "Could not find fulfillment"
        )
      }

      const evaluatedNoNotification =
        no_notification !== undefined
          ? no_notification
          : shipment.no_notification

      const shipmentRes = await this.fulfillmentService_
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingLinks, {
          metadata,
          no_notification: evaluatedNoNotification,
        })

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

      order.fulfillment_status = FulfillmentStatus.SHIPPED
      for (const item of order.items) {
        const shipped = shipmentRes.items.find((si) => si.item_id === item.id)
        if (shipped) {
          const shippedQty = (item.shipped_quantity || 0) + shipped.quantity
          if (shippedQty !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }

          await lineItemServiceTx.update(item.id, {
            shipped_quantity: shippedQty,
          })
        } else {
          if (item.shipped_quantity !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }
        }
      }

      const orderRepo = manager.withRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.SHIPMENT_CREATED, {
          id: orderId,
          fulfillment_id: shipmentRes.id,
          no_notification: evaluatedNoNotification,
        })

      return result
    })
  }

  /**
   * Updates the order's billing address.
   * @param order - the order to update
   * @param address - the value to set the billing address to
   * @return the result of the update operation
   */
  protected async updateBillingAddress(
    order: Order,
    address: Address
  ): Promise<void> {
    const addrRepo = this.activeManager_.withRepository(this.addressRepository_)
    address.country_code = address.country_code?.toLowerCase() ?? null

    const region = await this.regionService_
      .withTransaction(this.activeManager_)
      .retrieve(order.region_id, {
        relations: ["countries"],
      })

    if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the order region"
      )
    }

    address.country_code = address.country_code?.toLowerCase() ?? null

    if (order.billing_address_id) {
      const addr = await addrRepo.findOne({
        where: { id: order.billing_address_id },
      })

      if (address.metadata) {
        address.metadata = setMetadata(addr, address.metadata)
      }

      await addrRepo.save({ ...addr, ...address })
    } else {
      if (address.metadata) {
        address.metadata = setMetadata(null, address.metadata)
      }

      order.billing_address = addrRepo.create({ ...address })
    }
  }

  /**
   * Updates the order's shipping address.
   * @param order - the order to update
   * @param address - the value to set the shipping address to
   * @return the result of the update operation
   */
  protected async updateShippingAddress(
    order: Order,
    address: Address
  ): Promise<void> {
    const addrRepo = this.activeManager_.withRepository(this.addressRepository_)
    address.country_code = address.country_code?.toLowerCase() ?? null

    const region = await this.regionService_
      .withTransaction(this.activeManager_)
      .retrieve(order.region_id, {
        relations: ["countries"],
      })

    if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the order region"
      )
    }

    if (order.shipping_address_id) {
      const addr = await addrRepo.findOne({
        where: { id: order.shipping_address_id },
      })

      await addrRepo.save({ ...addr, ...address })
    } else {
      order.shipping_address = addrRepo.create({ ...address })
    }
  }

  async addShippingMethod(
    orderId: string,
    optionId: string,
    data?: Record<string, unknown>,
    config: CreateShippingMethodDto = {}
  ): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieveWithTotals(orderId, {
        relations: [
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.variant",
          "items.variant.product",
        ],
      })
      const { shipping_methods } = order

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A shipping method cannot be added to a canceled order"
        )
      }

      const newMethod = await this.shippingOptionService_
        .withTransaction(manager)
        .createShippingMethod(optionId, data ?? {}, { order, ...config })

      const shippingOptionServiceTx =
        this.shippingOptionService_.withTransaction(manager)

      const methods = [newMethod]
      if (shipping_methods.length) {
        for (const sm of shipping_methods) {
          if (
            sm.shipping_option.profile_id ===
            newMethod.shipping_option.profile_id
          ) {
            await shippingOptionServiceTx.deleteShippingMethods(sm)
          } else {
            methods.push(sm)
          }
        }
      }

      const result = await this.retrieve(orderId)
      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.UPDATED, { id: result.id })
      return result
    })
  }

  /**
   * Updates an order. Metadata updates should
   * use dedicated method, e.g. `setMetadata` etc. The function
   * will throw errors if metadata updates are attempted.
   * @param orderId - the id of the order. Must be a string that
   *   can be casted to an ObjectId
   * @param update - an object with the update values.
   * @return resolves to the update result.
   */
  async update(orderId: string, update: UpdateOrderInput): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be updated"
        )
      }

      if (
        (update.payment || update.items) &&
        (order.fulfillment_status !== "not_fulfilled" ||
          order.payment_status !== "awaiting" ||
          order.status !== "pending")
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }

      if (update.status || update.fulfillment_status || update.payment_status) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update order statuses. This will happen automatically. Use metadata in order for additional statuses"
        )
      }

      const {
        metadata,
        shipping_address,
        billing_address,
        no_notification,
        items,
        ...rest
      } = update

      if (update.metadata) {
        order.metadata = setMetadata(order, metadata ?? {})
      }

      if (update.shipping_address) {
        await this.updateShippingAddress(order, shipping_address as Address)
      }

      if (update.billing_address) {
        await this.updateBillingAddress(order, billing_address as Address)
      }

      if (update.no_notification) {
        order.no_notification = no_notification ?? false
      }

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)
      if (update.items) {
        for (const item of items as LineItem[]) {
          await lineItemServiceTx.create({
            ...item,
            order_id: orderId,
          })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        order[key] = value
      }

      const orderRepo = manager.withRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.UPDATED, {
          id: orderId,
          no_notification: order.no_notification,
        })
      return result
    })
  }

  /**
   * Cancels an order.
   * Throws if fulfillment process has been initiated.
   * Throws if payment process has been initiated.
   * @param orderId - id of order to cancel.
   * @return result of the update operation.
   */
  async cancel(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, {
        relations: [
          "refunds",
          "fulfillments",
          "payments",
          "returns",
          "claims",
          "swaps",
          "items",
        ],
      })

      if (order.refunds?.length > 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Order with refund(s) cannot be canceled"
        )
      }

      const throwErrorIf = (
        arr: (Fulfillment | Return | Swap | ClaimOrder)[],
        pred: (obj: Fulfillment | Return | Swap | ClaimOrder) => boolean,
        type: string
      ): void | never => {
        if (arr?.filter(pred).length) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `All ${type} must be canceled before canceling an order`
          )
        }
      }

      const notCanceled = (o): boolean => !o.canceled_at

      throwErrorIf(order.fulfillments, notCanceled, "fulfillments")
      throwErrorIf(
        order.returns,
        (r) => (r as Return).status !== "canceled",
        "returns"
      )
      throwErrorIf(order.swaps, notCanceled, "swaps")
      throwErrorIf(order.claims, notCanceled, "claims")

      const inventoryServiceTx =
        this.productVariantInventoryService_.withTransaction(manager)

      await Promise.all(
        order.items.map(async (item) => {
          if (item.variant_id) {
            return await inventoryServiceTx.deleteReservationsByLineItem(
              item.id,
              item.variant_id,
              item.quantity
            )
          }
        })
      )

      const paymentProviderServiceTx =
        this.paymentProviderService_.withTransaction(manager)
      for (const p of order.payments) {
        await paymentProviderServiceTx.cancelPayment(p)
      }

      order.status = OrderStatus.CANCELED
      order.fulfillment_status = FulfillmentStatus.CANCELED
      order.payment_status = PaymentStatus.CANCELED
      order.canceled_at = new Date()

      const orderRepo = manager.withRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.CANCELED, {
          id: order.id,
          no_notification: order.no_notification,
        })
      return result
    })
  }

  /**
   * Captures payment for an order.
   * @param orderId - id of order to capture payment for.
   * @return result of the update operation.
   */
  async capturePayment(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const orderRepo = manager.withRepository(this.orderRepository_)
      const order = await this.retrieve(orderId, { relations: ["payments"] })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot capture payment"
        )
      }

      const paymentProviderServiceTx =
        this.paymentProviderService_.withTransaction(manager)

      const payments: Payment[] = []
      for (const p of order.payments) {
        if (p.captured_at === null) {
          const result = await paymentProviderServiceTx
            .capturePayment(p)
            .catch(async (err) => {
              await this.eventBus_
                .withTransaction(manager)
                .emit(OrderService.Events.PAYMENT_CAPTURE_FAILED, {
                  id: orderId,
                  payment_id: p.id,
                  error: err,
                  no_notification: order.no_notification,
                })
            })

          if (result) {
            payments.push(result)
          } else {
            payments.push(p)
          }
        } else {
          payments.push(p)
        }
      }

      order.payments = payments
      order.payment_status = payments.every((p) => p.captured_at !== null)
        ? PaymentStatus.CAPTURED
        : PaymentStatus.REQUIRES_ACTION

      const result = await orderRepo.save(order)

      if (order.payment_status === PaymentStatus.CAPTURED) {
        await this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.PAYMENT_CAPTURED, {
            id: result.id,
            no_notification: order.no_notification,
          })
      }

      return result
    })
  }

  /**
   * Checks that a given quantity of a line item can be fulfilled. Fails if the
   * fulfillable quantity is lower than the requested fulfillment quantity.
   * Fulfillable quantity is calculated by subtracting the already fulfilled
   * quantity from the quantity that was originally purchased.
   * @param item - the line item to check has sufficient fulfillable
   *   quantity.
   * @param quantity - the quantity that is requested to be fulfilled.
   * @return a line item that has the requested fulfillment quantity
   *   set.
   */
  protected validateFulfillmentLineItem(
    item: LineItem,
    quantity: number
  ): LineItem | null {
    if (!item) {
      // This will in most cases be called by a webhook so to ensure that
      // things go through smoothly in instances where extra items outside
      // of Medusa are added we allow unknown items
      return null
    }

    if (quantity > item.quantity - item.fulfilled_quantity!) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot fulfill more items than have been purchased"
      )
    }
    return {
      ...item,
      quantity,
    } as LineItem
  }

  /**
   * Creates fulfillments for an order.
   * In a situation where the order has more than one shipping method,
   * we need to partition the order items, such that they can be sent
   * to their respective fulfillment provider.
   * @param orderId - id of order to cancel.
   * @param itemsToFulfill - items to fulfil.
   * @param config - the config to cancel.
   * @return result of the update operation.
   */
  async createFulfillment(
    orderId: string,
    itemsToFulfill: FulFillmentItemType[],
    config: {
      no_notification?: boolean
      location_id?: string
      metadata?: Record<string, unknown>
    } = {}
  ): Promise<Order> {
    const { metadata, no_notification, location_id } = config

    return await this.atomicPhase_(async (manager) => {
      // NOTE: we are telling the service to calculate all totals for us which
      // will add to what is fetched from the database. We want this to happen
      // so that we get all order details. These will thereafter be forwarded
      // to the fulfillment provider.
      const order = await this.retrieve(orderId, {
        select: [
          "subtotal",
          "shipping_total",
          "discount_total",
          "tax_total",
          "gift_card_total",
          "total",
        ],
        relations: [
          "discounts",
          "discounts.rule",
          "region",
          "fulfillments",
          "shipping_address",
          "billing_address",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.adjustments",
          "items.variant",
          "items.variant.product",
          "payments",
        ],
      })

      if (order.status === OrderStatus.CANCELED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be fulfilled"
        )
      }

      if (!order.shipping_methods?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot fulfill an order that lacks shipping methods"
        )
      }

      const fulfillments = await this.fulfillmentService_
        .withTransaction(manager)
        .createFulfillment(
          order as unknown as CreateFulfillmentOrder,
          itemsToFulfill,
          {
            metadata: metadata ?? {},
            no_notification: no_notification,
            order_id: orderId,
            location_id: location_id,
          }
        )
      let successfullyFulfilled: FulfillmentItem[] = []
      for (const f of fulfillments) {
        successfullyFulfilled = [...successfullyFulfilled, ...f.items]
      }

      order.fulfillment_status = FulfillmentStatus.FULFILLED

      // Update all line items to reflect fulfillment
      for (const item of order.items) {
        const fulfillmentItem = successfullyFulfilled.find(
          (f) => item.id === f.item_id
        )

        if (fulfillmentItem) {
          const fulfilledQuantity =
            (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

          // Update the fulfilled quantity
          await this.lineItemService_.withTransaction(manager).update(item.id, {
            fulfilled_quantity: fulfilledQuantity,
          })

          if (item.quantity !== fulfilledQuantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_FULFILLED
          }
        } else {
          if (item.quantity !== item.fulfilled_quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_FULFILLED
          }
        }
      }
      const orderRepo = manager.withRepository(this.orderRepository_)

      order.fulfillments = [...order.fulfillments, ...fulfillments]

      const result = await orderRepo.save(order)

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      const eventsToEmit = fulfillments.map((fulfillment) => ({
        eventName: OrderService.Events.FULFILLMENT_CREATED,
        data: {
          id: orderId,
          fulfillment_id: fulfillment.id,
          no_notification: evaluatedNoNotification,
        },
      }))
      await this.eventBus_.withTransaction(manager).emit(eventsToEmit)

      return result
    })
  }

  /**
   * Cancels a fulfillment (if related to an order)
   * @param fulfillmentId - the ID of the fulfillment to cancel
   * @return updated order
   */
  async cancelFulfillment(fulfillmentId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const canceled = await this.fulfillmentService_
        .withTransaction(manager)
        .cancelFulfillment(fulfillmentId)

      if (!canceled.order_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Fufillment not related to an order`
        )
      }

      const order = await this.retrieve(canceled.order_id)

      order.fulfillment_status = FulfillmentStatus.CANCELED

      const orderRepo = manager.withRepository(this.orderRepository_)
      const updated = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.FULFILLMENT_CANCELED, {
          id: order.id,
          fulfillment_id: canceled.id,
          no_notification: canceled.no_notification,
        })

      return updated
    })
  }

  /**
   * Retrieves the order line items, given an array of items.
   * @param order - the order to get line items from
   * @param items - the items to get
   * @param transformer - a function to apply to each of the items
   *    retrieved from the order, should return a line item. If the transformer
   *    returns an undefined value the line item will be filtered from the
   *    returned array.
   * @return the line items generated by the transformer.
   */
  protected async getFulfillmentItems(
    order: Order,
    items: FulFillmentItemType[],
    transformer: (item: LineItem | undefined, quantity: number) => unknown
  ): Promise<LineItem[]> {
    return (
      await Promise.all(
        items.map(async ({ item_id, quantity }) => {
          const item = order.items.find((i) => i.id === item_id)
          return transformer(item, quantity)
        })
      )
    ).filter((i) => !!i) as LineItem[]
  }

  /**
   * Archives an order. It only alloved, if the order has been fulfilled
   * and payment has been captured.
   * @param orderId - the order to archive
   * @return the result of the update operation
   */
  async archive(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status !== ("completed" || "refunded")) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't archive an unprocessed order"
        )
      }

      order.status = OrderStatus.ARCHIVED
      const orderRepo = manager.withRepository(this.orderRepository_)
      return await orderRepo.save(order)
    })
  }

  /**
   * Refunds a given amount back to the customer.
   * @param orderId - id of the order to refund.
   * @param refundAmount - the amount to refund.
   * @param reason - the reason to refund.
   * @param note - note for refund.
   * @param config - the config for refund.
   * @return the result of the refund operation.
   */
  async createRefund(
    orderId: string,
    refundAmount: number,
    reason: string,
    note?: string,
    config: { no_notification?: boolean } = {
      no_notification: undefined,
    }
  ): Promise<Order> {
    const { no_notification } = config

    return await this.atomicPhase_(async (manager) => {
      const orderRepo = manager.withRepository(this.orderRepository_)

      const order = await this.retrieve(orderId, {
        select: ["refundable_amount", "total", "refunded_total"],
        relations: ["payments"],
      })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be refunded"
        )
      }

      if (refundAmount > order.refundable_amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot refund more than the original order amount"
        )
      }

      const refund = await this.paymentProviderService_
        .withTransaction(manager)
        .refundPayment(order.payments, refundAmount, reason, note)

      let result = await this.retrieveWithTotals(orderId, {
        relations: ["payments"],
      })

      if (result.refunded_total > 0 && result.refundable_amount > 0) {
        result.payment_status = PaymentStatus.PARTIALLY_REFUNDED
        result = await orderRepo.save(result)
      }

      if (
        result.paid_total > 0 &&
        result.refunded_total === result.paid_total
      ) {
        result.payment_status = PaymentStatus.REFUNDED
        result = await orderRepo.save(result)
      }

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.REFUND_CREATED, {
          id: result.id,
          refund_id: refund.id,
          no_notification: evaluatedNoNotification,
        })
      return result
    })
  }

  protected async decorateTotalsLegacy(
    order: Order,
    totalsFields: string[] = []
  ): Promise<Order> {
    if (totalsFields.some((field) => ["subtotal", "total"].includes(field))) {
      const calculationContext =
        await this.totalsService_.getCalculationContext(order, {
          exclude_shipping: true,
        })
      order.items = await Promise.all(
        (order.items || []).map(async (item) => {
          const itemTotals = await this.totalsService_.getLineItemTotals(
            item,
            order,
            {
              include_tax: true,
              calculation_context: calculationContext,
            }
          )

          return Object.assign(item, itemTotals)
        })
      )
    }

    for (const totalField of totalsFields) {
      switch (totalField) {
        case "shipping_total": {
          order.shipping_total = await this.totalsService_.getShippingTotal(
            order
          )
          break
        }
        case "gift_card_total": {
          const giftCardBreakdown = await this.totalsService_.getGiftCardTotal(
            order
          )
          order.gift_card_total = giftCardBreakdown.total
          order.gift_card_tax_total = giftCardBreakdown.tax_total
          break
        }
        case "discount_total": {
          order.discount_total = await this.totalsService_.getDiscountTotal(
            order
          )
          break
        }
        case "tax_total": {
          order.tax_total = await this.totalsService_.getTaxTotal(order)
          break
        }
        case "subtotal": {
          order.subtotal = await this.totalsService_.getSubtotal(order)
          break
        }
        case "total": {
          order.total = await this.totalsService_
            .withTransaction(this.activeManager_)
            .getTotal(order)
          break
        }
        case "refunded_total": {
          order.refunded_total = this.totalsService_.getRefundedTotal(order)
          break
        }
        case "paid_total": {
          order.paid_total = this.totalsService_.getPaidTotal(order)
          break
        }
        case "refundable_amount": {
          const paid_total = this.totalsService_.getPaidTotal(order)
          const refunded_total = this.totalsService_.getRefundedTotal(order)
          order.refundable_amount = paid_total - refunded_total
          break
        }
        case "items.refundable": {
          const items: LineItem[] = []
          for (const item of order.items) {
            items.push({
              ...item,
              refundable: await this.totalsService_.getLineItemRefund(order, {
                ...item,
                quantity: item.quantity - (item.returned_quantity || 0),
              } as LineItem),
            } as LineItem)
          }
          order.items = items
          break
        }
        case "swaps.additional_items.refundable": {
          for (const s of order.swaps) {
            const items: LineItem[] = []
            for (const item of s.additional_items) {
              items.push({
                ...item,
                refundable: await this.totalsService_.getLineItemRefund(order, {
                  ...item,
                  quantity: item.quantity - (item.returned_quantity || 0),
                } as LineItem),
              } as LineItem)
            }
            s.additional_items = items
          }
          break
        }
        case "claims.additional_items.refundable": {
          for (const c of order.claims) {
            const items: LineItem[] = []
            for (const item of c.additional_items) {
              items.push({
                ...item,
                refundable: await this.totalsService_.getLineItemRefund(order, {
                  ...item,
                  quantity: item.quantity - (item.returned_quantity || 0),
                } as LineItem),
              } as LineItem)
            }
            c.additional_items = items
          }
          break
        }
        default: {
          break
        }
      }
    }
    return order
  }

  async decorateTotals(order: Order, totalsFields?: string[]): Promise<Order>

  async decorateTotals(order: Order, context?: TotalsContext): Promise<Order>

  /**
   * Calculate and attach the different total fields on the object
   * @param order
   * @param totalsFieldsOrContext
   */
  async decorateTotals(
    order: Order,
    totalsFieldsOrContext?: string[] | TotalsContext
  ): Promise<Order> {
    if (Array.isArray(totalsFieldsOrContext)) {
      if (totalsFieldsOrContext.length) {
        return await this.decorateTotalsLegacy(order, totalsFieldsOrContext)
      }
      totalsFieldsOrContext = {}
    }

    const newTotalsServiceTx = this.newTotalsService_.withTransaction(
      this.activeManager_
    )

    const calculationContext = await this.totalsService_.getCalculationContext(
      order
    )

    const { returnable_items } = totalsFieldsOrContext?.includes ?? {}

    const returnableItems: LineItem[] | undefined = isDefined(returnable_items)
      ? []
      : undefined

    const isReturnableItem = (item) =>
      returnable_items &&
      (item.returned_quantity ?? 0) < (item.shipped_quantity ?? 0)

    const allItems: LineItem[] = [...(order.items ?? [])]

    if (returnable_items) {
      // All items must receive their totals and if some of them are returnable
      // They will be pushed to `returnable_items` at a later point
      allItems.push(
        ...(order.swaps?.map((s) => s.additional_items ?? []).flat() ?? []),
        ...(order.claims?.map((c) => c.additional_items ?? []).flat() ?? [])
      )
    }

    const orderShippingMethods = [...(order.shipping_methods ?? [])]

    const itemsTotals = await newTotalsServiceTx.getLineItemTotals(allItems, {
      taxRate: order.tax_rate,
      includeTax: true,
      calculationContext,
    })
    const shippingTotals = await newTotalsServiceTx.getShippingMethodTotals(
      orderShippingMethods,
      {
        taxRate: order.tax_rate,
        discounts: order.discounts,
        includeTax: true,
        calculationContext,
      }
    )

    order.subtotal = 0
    order.discount_total = 0
    order.shipping_total = 0
    order.refunded_total =
      Math.round(order.refunds?.reduce((acc, next) => acc + next.amount, 0)) ||
      0
    order.paid_total =
      order.payments?.reduce((acc, next) => (acc += next.amount), 0) || 0
    order.refundable_amount = order.paid_total - order.refunded_total || 0

    let item_tax_total = 0
    let shipping_tax_total = 0

    order.items = (order.items || []).map((item) => {
      item.quantity = item.quantity - (item.returned_quantity || 0)
      const refundable = newTotalsServiceTx.getLineItemRefund(item, {
        calculationContext,
        taxRate: order.tax_rate,
      })

      Object.assign(item, itemsTotals[item.id] ?? {}, { refundable })

      order.subtotal += item.subtotal ?? 0
      order.discount_total += item.raw_discount_total ?? 0
      item_tax_total += item.tax_total ?? 0

      if (isReturnableItem(item)) {
        returnableItems?.push(item)
      }

      return item
    })

    order.shipping_methods = (order.shipping_methods || []).map(
      (shippingMethod) => {
        const methodWithTotals = Object.assign(
          shippingMethod,
          shippingTotals[shippingMethod.id] ?? {}
        )

        order.shipping_total += methodWithTotals.subtotal ?? 0
        shipping_tax_total += methodWithTotals.tax_total ?? 0

        return methodWithTotals
      }
    )

    const giftCardTotal = await this.newTotalsService_.getGiftCardTotals(
      order.subtotal - order.discount_total,
      {
        region: order.region,
        giftCards: order.gift_cards,
        giftCardTransactions: order.gift_card_transactions ?? [],
      }
    )
    order.gift_card_total = giftCardTotal.total || 0
    order.gift_card_tax_total = giftCardTotal.tax_total || 0

    order.tax_total =
      item_tax_total + shipping_tax_total - order.gift_card_tax_total

    for (const swap of order.swaps ?? []) {
      swap.additional_items = swap.additional_items.map((item) => {
        item.quantity = item.quantity - (item.returned_quantity || 0)
        const refundable = newTotalsServiceTx.getLineItemRefund(item, {
          calculationContext,
          taxRate: order.tax_rate,
        })

        Object.assign(item, itemsTotals[item.id] ?? {}, { refundable })

        if (isReturnableItem(item)) {
          returnableItems?.push(item)
        }

        return item
      })
    }

    for (const claim of order.claims ?? []) {
      claim.additional_items = claim.additional_items.map((item) => {
        item.quantity = item.quantity - (item.returned_quantity || 0)
        const refundable = newTotalsServiceTx.getLineItemRefund(item, {
          calculationContext,
          taxRate: order.tax_rate,
        })

        Object.assign(item, itemsTotals[item.id] ?? {}, { refundable })

        if (isReturnableItem(item)) {
          returnableItems?.push(item)
        }

        return item
      })
    }

    order.raw_discount_total = order.discount_total
    order.discount_total = Math.round(order.discount_total)

    order.total =
      order.subtotal +
      order.shipping_total +
      order.tax_total -
      (order.gift_card_total + order.discount_total)

    order.returnable_items = returnableItems

    return order
  }

  /**
   * Handles receiving a return. This will create a
   * refund to the customer. If the returned items don't match the requested
   * items the return status will be updated to requires_action. This behaviour
   * is useful in sitautions where a custom refund amount is requested, but the
   * retuned items are not matching the requested items. Setting the
   * allowMismatch argument to true, will process the return, ignoring any
   * mismatches.
   * @param orderId - the order to return.
   * @param receivedReturn - the received return
   * @param customRefundAmount - the custom refund amount return
   * @return the result of the update operation
   */
  async registerReturnReceived(
    orderId: string,
    receivedReturn: Return,
    customRefundAmount?: number
  ): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, {
        select: ["total", "refunded_total", "refundable_amount"],
        relations: ["items", "returns", "payments"],
      })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be registered as received"
        )
      }

      if (!receivedReturn || receivedReturn.order_id !== orderId) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Received return does not exist`
        )
      }

      const refundAmount = customRefundAmount ?? receivedReturn.refund_amount

      const orderRepo = manager.withRepository(this.orderRepository_)

      if (refundAmount > order.refundable_amount) {
        order.fulfillment_status = FulfillmentStatus.REQUIRES_ACTION
        const result = await orderRepo.save(order)
        await this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.RETURN_ACTION_REQUIRED, {
            id: result.id,
            return_id: receivedReturn.id,
            no_notification: receivedReturn.no_notification,
          })
        return result
      }

      let isFullReturn = true
      for (const i of order.items) {
        if (i.returned_quantity !== i.quantity) {
          isFullReturn = false
        }
      }

      if (refundAmount > 0) {
        const refund = await this.paymentProviderService_
          .withTransaction(manager)
          .refundPayment(order.payments, refundAmount, "return")

        order.refunds = [...(order.refunds || []), refund]
      }

      if (isFullReturn) {
        order.fulfillment_status = FulfillmentStatus.RETURNED
      } else {
        order.fulfillment_status = FulfillmentStatus.PARTIALLY_RETURNED
      }

      const result = await orderRepo.save(order)
      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.ITEMS_RETURNED, {
          id: order.id,
          return_id: receivedReturn.id,
          no_notification: receivedReturn.no_notification,
        })
      return result
    })
  }

  private getTotalsRelations(config: FindConfig<Order>): string[] {
    const relationSet = new Set(config.relations)

    relationSet.add("items")
    relationSet.add("items.tax_lines")
    relationSet.add("items.adjustments")
    relationSet.add("items.variant")
    relationSet.add("swaps")
    relationSet.add("swaps.additional_items")
    relationSet.add("swaps.additional_items.tax_lines")
    relationSet.add("swaps.additional_items.adjustments")
    relationSet.add("claims")
    relationSet.add("claims.additional_items")
    relationSet.add("claims.additional_items.tax_lines")
    relationSet.add("claims.additional_items.adjustments")
    relationSet.add("discounts")
    relationSet.add("discounts.rule")
    relationSet.add("gift_cards")
    relationSet.add("gift_card_transactions")
    relationSet.add("refunds")
    relationSet.add("shipping_methods")
    relationSet.add("shipping_methods.tax_lines")
    relationSet.add("region")

    return Array.from(relationSet.values())
  }
}

export default OrderService
