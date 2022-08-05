import { MedusaError } from "medusa-core-utils"
import { Brackets, EntityManager } from "typeorm"
import CustomerService from "./customer"
import { OrderRepository } from "../repositories/order"
import PaymentProviderService from "./payment-provider"
import ShippingOptionService from "./shipping-option"
import ShippingProfileService from "./shipping-profile"
import DiscountService from "./discount"
import FulfillmentProviderService from "./fulfillment-provider"
import FulfillmentService from "./fulfillment"
import LineItemService from "./line-item"
import TotalsService from "./totals"
import RegionService from "./region"
import CartService from "./cart"
import { AddressRepository } from "../repositories/address"
import GiftCardService from "./gift-card"
import DraftOrderService from "./draft-order"
import InventoryService from "./inventory"
import EventBusService from "./event-bus"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, setMetadata } from "../utils"
import { FindConfig, QuerySelector, Selector } from "../types/common"
import {
  Address,
  ClaimOrder,
  Fulfillment,
  FulfillmentItem,
  FulfillmentStatus,
  LineItem,
  Order,
  OrderStatus,
  Payment,
  PaymentSession,
  PaymentStatus,
  Return,
  Swap,
  TrackingLink,
} from "../models"
import { UpdateOrderInput } from "../types/orders"
import { CreateShippingMethodDto } from "../types/shipping-options"
import {
  CreateFulfillmentOrder,
  FulFillmentItemType,
} from "../types/fulfillment"

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
  regionService: RegionService
  cartService: CartService
  addressRepository: typeof AddressRepository
  giftCardService: GiftCardService
  draftOrderService: DraftOrderService
  inventoryService: InventoryService
  eventBusService: EventBusService
}

class OrderService extends TransactionBaseService<OrderService> {
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

  protected manager_: EntityManager
  protected transactionManager_: EntityManager

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
  protected readonly regionService_: RegionService
  protected readonly cartService_: CartService
  protected readonly addressRepository_: typeof AddressRepository
  protected readonly giftCardService_: GiftCardService
  protected readonly draftOrderService_: DraftOrderService
  protected readonly inventoryService_: InventoryService
  protected readonly eventBus_: EventBusService

  constructor({
    manager,
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
    regionService,
    cartService,
    addressRepository,
    giftCardService,
    draftOrderService,
    inventoryService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.orderRepository_ = orderRepository
    this.customerService_ = customerService
    this.paymentProviderService_ = paymentProviderService
    this.shippingProfileService_ = shippingProfileService
    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.lineItemService_ = lineItemService
    this.totalsService_ = totalsService
    this.regionService_ = regionService
    this.fulfillmentService_ = fulfillmentService
    this.discountService_ = discountService
    this.giftCardService_ = giftCardService
    this.eventBus_ = eventBusService
    this.shippingOptionService_ = shippingOptionService
    this.cartService_ = cartService
    this.addressRepository_ = addressRepository
    this.draftOrderService_ = draftOrderService
    this.inventoryService_ = inventoryService
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
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)
    const query = buildQuery(selector, config)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    if (select && select.length) {
      query.select = select
    }

    if (relations && relations.length) {
      query.relations = relations
    }

    const raw = await orderRepo.find(query)

    return await Promise.all(
      raw.map(async (r) => await this.decorateTotals(r, totalsToSelect))
    )
  }

  async listAndCount(
    selector: QuerySelector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<[Order[], number]> {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    let q
    if (selector.q) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where

      delete where.display_id
      delete where.email

      query.join = {
        alias: "order",
        innerJoin: {
          shipping_address: "order.shipping_address",
        },
      }

      query.where = (qb): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where(`shipping_address.first_name ILIKE :qfn`, {
              qfn: `%${q}%`,
            })
              .orWhere(`order.email ILIKE :q`, { q: `%${q}%` })
              .orWhere(`display_id::varchar(255) ILIKE :dId`, { dId: `${q}` })
          })
        )
      }
    }

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    if (select && select.length) {
      query.select = select
    }

    const rels = relations
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
      relations = [...relationSet]

      select = select.filter((v) => !totalFields.includes(v))
    }

    const toSelect = [...select]
    if (toSelect.length > 0 && toSelect.indexOf("tax_rate") === -1) {
      toSelect.push("tax_rate")
    }

    return {
      relations,
      select: toSelect,
      totalsToSelect,
    }
  }

  /**
   * Gets an order by id.
   * @param orderId - id of order to retrieve
   * @param config - config of order to retrieve
   * @return the order document
   */
  async retrieve(
    orderId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    const query = {
      where: { id: orderId },
    } as FindConfig<Order>

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const rels = query.relations
    delete query.relations
    const raw = await orderRepo.findOneWithRelations(rels, query)
    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ${orderId} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
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
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    const query = {
      where: { cart_id: cartId },
    } as FindConfig<Order>

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const raw = await orderRepo.findOne(query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with cart id: ${cartId} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
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
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)

    const query = {
      where: { external_id: externalId },
    } as FindConfig<Order>

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const rels = query.relations
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
   * Checks the existence of an order by cart id.
   * @param cartId - cart id to find order
   * @return the order document
   */
  async existsByCartId(cartId: string): Promise<boolean> {
    const order = await this.retrieveByCartId(cartId).catch(() => undefined)
    return !!order
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

      await this.eventBus_.emit(OrderService.Events.COMPLETED, {
        id: orderId,
        no_notification: order.no_notification,
      })

      order.status = OrderStatus.COMPLETED

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      return orderRepo.save(order)
    })
  }

  /**
   * Creates an order from a cart
   * @param cartId - id of the cart to create an order from
   * @return resolves to the creation result.
   */
  async createFromCart(cartId: string): Promise<Order | never> {
    return await this.atomicPhase_(async (manager) => {
      const cartService = this.cartService_.withTransaction(manager)
      const inventoryService = this.inventoryService_.withTransaction(manager)

      const cart = await cartService.retrieve(cartId, {
        select: ["subtotal", "total"],
        relations: [
          "region",
          "payment",
          "items",
          "discounts",
          "discounts.rule",
          "gift_cards",
          "shipping_methods",
        ],
      })

      if (cart.items.length === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot create order from empty cart"
        )
      }

      const { payment, region, total } = cart

      for (const item of cart.items) {
        try {
          await inventoryService.confirmInventory(
            item.variant_id,
            item.quantity
          )
        } catch (err) {
          if (payment) {
            await this.paymentProviderService_
              .withTransaction(manager)
              .cancelPayment(payment)
          }
          await cartService.update(cart.id, { payment_authorized_at: null })
          throw err
        }
      }

      const exists = await this.existsByCartId(cart.id)
      if (exists) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "Order from cart already exists"
        )
      }

      // Would be the case if a discount code is applied that covers the item
      // total
      if (total !== 0) {
        // Throw if payment method does not exist
        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment method"
          )
        }

        /* The force cast here is necessary until the rethink of the payment API
           It has been discussed with seb that we still pass a payment here */
        const paymentStatus = await this.paymentProviderService_
          .withTransaction(manager)
          .getStatus(payment)

        // If payment status is not authorized, we throw
        if (paymentStatus !== "authorized") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)

      const toCreate = {
        payment_status: "awaiting",
        discounts: cart.discounts,
        gift_cards: cart.gift_cards,
        shipping_methods: cart.shipping_methods,
        shipping_address_id: cart.shipping_address_id,
        billing_address_id: cart.billing_address_id,
        region_id: cart.region_id,
        email: cart.email,
        customer_id: cart.customer_id,
        cart_id: cart.id,
        currency_code: region.currency_code,
        metadata: cart.metadata || {},
      } as Partial<Order>

      if (cart.type === "draft_order") {
        const draft = await this.draftOrderService_
          .withTransaction(manager)
          .retrieveByCartId(cart.id)

        toCreate.draft_order_id = draft.id
        toCreate.no_notification = draft.no_notification_order
      }

      const o = orderRepo.create(toCreate)
      const result = await orderRepo.save(o)

      if (total !== 0 && payment) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .updatePayment(payment.id, {
            order_id: result.id,
          })
      }

      let gcBalance = await this.totalsService_.getGiftCardableAmount(cart)
      const gcService = this.giftCardService_.withTransaction(manager)

      for (const g of cart.gift_cards) {
        const newBalance = Math.max(0, g.balance - gcBalance)
        const usage = g.balance - newBalance
        await gcService.update(g.id, {
          balance: newBalance,
          is_disabled: newBalance === 0,
        })

        await gcService.createTransaction({
          gift_card_id: g.id,
          order_id: result.id,
          amount: usage,
          is_taxable: cart.region.gift_cards_taxable,
          tax_rate: cart.region.gift_cards_taxable
            ? cart.region.tax_rate
            : null,
        })

        gcBalance = gcBalance - usage
      }

      for (const method of cart.shipping_methods) {
        await this.shippingOptionService_
          .withTransaction(manager)
          .updateShippingMethod(method.id, { order_id: result.id })
      }

      const lineItemService = this.lineItemService_.withTransaction(manager)
      for (const item of cart.items) {
        await lineItemService.update(item.id, { order_id: result.id })
      }

      for (const item of cart.items) {
        await inventoryService.adjustInventory(item.variant_id, -item.quantity)
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.PLACED, {
          id: result.id,
          no_notification: result.no_notification,
        })

      await cartService.update(cart.id, { completed_at: new Date() })

      return result
    })
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

      order.fulfillment_status = FulfillmentStatus.SHIPPED
      for (const item of order.items) {
        const shipped = shipmentRes.items.find((si) => si.item_id === item.id)
        if (shipped) {
          const shippedQty = (item.shipped_quantity || 0) + shipped.quantity
          if (shippedQty !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }

          await this.lineItemService_.withTransaction(manager).update(item.id, {
            shipped_quantity: shippedQty,
          })
        } else {
          if (item.shipped_quantity !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }
        }
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
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
    const addrRepo = this.manager_.getCustomRepository(this.addressRepository_)
    address.country_code = address.country_code?.toLowerCase() ?? null

    const region = await this.regionService_
      .withTransaction(this.manager_)
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

      await addrRepo.save({ ...addr, ...address })
    } else {
      const created = await addrRepo.create({ ...address })
      await addrRepo.save(created)
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
    const addrRepo = this.manager_.getCustomRepository(this.addressRepository_)
    address.country_code = address.country_code?.toLowerCase() ?? null

    const region = await this.regionService_
      .withTransaction(this.manager_)
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
      const created = addrRepo.create({ ...address })
      await addrRepo.save(created)
    }
  }

  async addShippingMethod(
    orderId: string,
    optionId: string,
    data?: Record<string, unknown>,
    config: CreateShippingMethodDto = {}
  ): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, {
        select: ["subtotal"],
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

      const methods = [newMethod]
      if (shipping_methods.length) {
        for (const sm of shipping_methods) {
          if (
            sm.shipping_option.profile_id ===
            newMethod.shipping_option.profile_id
          ) {
            await this.shippingOptionService_
              .withTransaction(manager)
              .deleteShippingMethods(sm)
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

      if (update.items) {
        for (const item of items as LineItem[]) {
          await this.lineItemService_.withTransaction(manager).create({
            ...item,
            order_id: orderId,
          })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        order[key] = value
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
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

      for (const item of order.items) {
        await this.inventoryService_
          .withTransaction(manager)
          .adjustInventory(item.variant_id, item.quantity)
      }

      for (const p of order.payments) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .cancelPayment(p)
      }

      order.status = OrderStatus.CANCELED
      order.fulfillment_status = FulfillmentStatus.CANCELED
      order.payment_status = PaymentStatus.CANCELED
      order.canceled_at = new Date()

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
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
      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const order = await this.retrieve(orderId, { relations: ["payments"] })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot capture payment"
        )
      }

      const payments: Payment[] = []
      for (const p of order.payments) {
        if (p.captured_at === null) {
          const result = await this.paymentProviderService_
            .withTransaction(manager)
            .capturePayment(p)
            .catch((err) => {
              this.eventBus_
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
        this.eventBus_
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

    if (quantity > item.quantity - item.fulfilled_quantity) {
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
      metadata?: Record<string, unknown>
    } = {
      no_notification: undefined,
      metadata: {},
    }
  ): Promise<Order> {
    const { metadata, no_notification } = config

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
            metadata,
            no_notification: no_notification,
            order_id: orderId,
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
      const orderRepo = manager.getCustomRepository(this.orderRepository_)

      order.fulfillments = [...order.fulfillments, ...fulfillments]

      const result = await orderRepo.save(order)

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      for (const fulfillment of fulfillments) {
        await this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.FULFILLMENT_CREATED, {
            id: orderId,
            fulfillment_id: fulfillment.id,
            no_notification: evaluatedNoNotification,
          })
      }

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

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
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
      const orderRepo = manager.getCustomRepository(this.orderRepository_)
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

      const result = await this.retrieve(orderId)

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      this.eventBus_.emit(OrderService.Events.REFUND_CREATED, {
        id: result.id,
        refund_id: refund.id,
        no_notification: evaluatedNoNotification,
      })
      return result
    })
  }

  protected async decorateTotals(
    order: Order,
    totalsFields: string[] = []
  ): Promise<Order> {
    for (const totalField of totalsFields) {
      switch (totalField) {
        case "shipping_total": {
          order.shipping_total = this.totalsService_.getShippingTotal(order)
          break
        }
        case "gift_card_total": {
          const giftCardBreakdown = this.totalsService_.getGiftCardTotal(order)
          order.gift_card_total = giftCardBreakdown.total
          order.gift_card_tax_total = giftCardBreakdown.tax_total
          break
        }
        case "discount_total": {
          order.discount_total = this.totalsService_.getDiscountTotal(order)
          break
        }
        case "tax_total": {
          order.tax_total = await this.totalsService_.getTaxTotal(order)
          break
        }
        case "subtotal": {
          order.subtotal = this.totalsService_.getSubtotal(order)
          break
        }
        case "total": {
          order.total = await this.totalsService_
            .withTransaction(this.manager_)
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
          order.items = order.items.map((i) => ({
            ...i,
            refundable: this.totalsService_.getLineItemRefund(order, {
              ...i,
              quantity: i.quantity - (i.returned_quantity || 0),
            } as LineItem),
          })) as LineItem[]
          break
        }
        case "swaps.additional_items.refundable": {
          for (const s of order.swaps) {
            s.additional_items = s.additional_items.map((i) => ({
              ...i,
              refundable: this.totalsService_.getLineItemRefund(order, {
                ...i,
                quantity: i.quantity - (i.returned_quantity || 0),
              } as LineItem),
            })) as LineItem[]
          }
          break
        }
        case "claims.additional_items.refundable": {
          for (const c of order.claims) {
            c.additional_items = c.additional_items.map((i) => ({
              ...i,
              refundable: this.totalsService_.getLineItemRefund(order, {
                ...i,
                quantity: i.quantity - (i.returned_quantity || 0),
              } as LineItem),
            })) as LineItem[]
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

      const refundAmount = customRefundAmount || receivedReturn.refund_amount

      const orderRepo = manager.getCustomRepository(this.orderRepository_)

      if (refundAmount > order.refundable_amount) {
        order.fulfillment_status = FulfillmentStatus.REQUIRES_ACTION
        const result = await orderRepo.save(order)
        this.eventBus_
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

      if (receivedReturn.refund_amount > 0) {
        const refund = await this.paymentProviderService_
          .withTransaction(manager)
          .refundPayment(order.payments, receivedReturn.refund_amount, "return")

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
}

export default OrderService
