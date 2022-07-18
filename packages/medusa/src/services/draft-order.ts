import { MedusaError } from "medusa-core-utils"
import { Brackets, EntityManager, FindManyOptions, UpdateResult } from "typeorm"
import { DraftOrderRepository } from "../repositories/draft-order"
import { PaymentRepository } from "../repositories/payment"
import EventBusService from "./event-bus"
import CartService from "./cart"
import LineItemService from "./line-item"
import { OrderRepository } from "../repositories/order"
import ProductVariantService from "./product-variant"
import ShippingOptionService from "./shipping-option"
import { DraftOrder, DraftOrderStatus, Cart, CartType } from "../models"
import { AdminPostDraftOrdersReq } from "../api/routes/admin/draft-orders"
import { TransactionBaseService } from "../interfaces"
import { ExtendedFindConfig, FindConfig } from "../types/common"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  draftOrderRepository: typeof DraftOrderRepository
  paymentRepository: typeof PaymentRepository
  orderRepository: typeof OrderRepository
  eventBusService: EventBusService
  cartService: CartService
  lineItemService: LineItemService
  productVariantService: ProductVariantService
  shippingOptionService: ShippingOptionService
}

/**
 * Handles draft orders
 * @implements {BaseService}
 */
class DraftOrderService extends TransactionBaseService<DraftOrderService> {
  static readonly Events = {
    CREATED: "draft_order.created",
    UPDATED: "draft_order.updated",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly draftOrderRepository_: typeof DraftOrderRepository
  protected readonly paymentRepository_: typeof PaymentRepository
  protected readonly orderRepository_: typeof OrderRepository
  protected readonly eventBus_: EventBusService
  protected readonly cartService_: CartService
  protected readonly lineItemService_: LineItemService
  protected readonly productVariantService_: ProductVariantService
  protected readonly shippingOptionService_: ShippingOptionService

  constructor({
    manager,
    draftOrderRepository,
    paymentRepository,
    orderRepository,
    eventBusService,
    cartService,
    lineItemService,
    productVariantService,
    shippingOptionService,
  }: InjectedDependencies) {
    super({
      manager,
      draftOrderRepository,
      paymentRepository,
      orderRepository,
      eventBusService,
      cartService,
      lineItemService,
      productVariantService,
      shippingOptionService,
    })

    this.manager_ = manager
    this.draftOrderRepository_ = draftOrderRepository
    this.paymentRepository_ = paymentRepository
    this.orderRepository_ = orderRepository
    this.lineItemService_ = lineItemService
    this.cartService_ = cartService
    this.productVariantService_ = productVariantService
    this.shippingOptionService_ = shippingOptionService
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a draft order with the given id.
   * @param id - id of the draft order to retrieve
   * @param config - query object for findOne
   * @return the draft order
   */
  async retrieve(
    id: string,
    config: FindConfig<DraftOrder> = {}
  ): Promise<DraftOrder | never> {
    const manager = this.manager_
    const draftOrderRepo = manager.getCustomRepository(
      this.draftOrderRepository_
    )

    const query = buildQuery({ id }, config)
    const draftOrder = await draftOrderRepo.findOne(query)
    if (!draftOrder) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Draft order with ${id} was not found`
      )
    }

    return draftOrder
  }

  /**
   * Retrieves a draft order based on its associated cart id
   * @param cartId - cart id that the draft orders's cart has
   * @param config - query object for findOne
   * @return the draft order
   */
  async retrieveByCartId(
    cartId: string,
    config: FindConfig<DraftOrder> = {}
  ): Promise<DraftOrder | never> {
    const manager = this.manager_
    const draftOrderRepo = manager.getCustomRepository(
      this.draftOrderRepository_
    )

    const query = buildQuery({ cart_id: cartId }, config)
    const draftOrder = await draftOrderRepo.findOne(query)
    if (!draftOrder) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Draft order was not found`
      )
    }

    return draftOrder
  }

  /**
   * Deletes draft order idempotently.
   * @param {string} draftOrderId - id of draft order to delete
   * @return {Promise<DraftOrder | undefined>} empty promise
   */
  async delete(draftOrderId: string): Promise<DraftOrder | undefined> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const draftOrderRepo = transactionManager.getCustomRepository(
          this.draftOrderRepository_
        )
        const draftOrder = await draftOrderRepo.findOne({
          where: { id: draftOrderId },
        })

        if (!draftOrder) {
          return
        }
        return await draftOrderRepo.remove(draftOrder)
      }
    )
  }

  /**
   * Lists draft orders alongside the count
   * @param selector - query selector to filter draft orders
   * @param config - query config
   * @return draft orders
   */
  async listAndCount(
    selector,
    config: FindConfig<DraftOrder> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<[DraftOrder[], number]> {
    const manager = this.manager_
    const draftOrderRepository = manager.getCustomRepository(
      this.draftOrderRepository_
    )

    const { q, ...restSelector } = selector
    const query = buildQuery(
      restSelector,
      config
    ) as FindManyOptions<DraftOrder> & ExtendedFindConfig<DraftOrder>

    if (q) {
      const where = query.where
      delete where?.display_id

      query.join = {
        alias: "draft_order",
        innerJoin: {
          cart: "draft_order.cart",
        },
      }

      query.where = (qb): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where(`cart.email ILIKE :q`, {
              q: `%${q}%`,
            }).orWhere(`draft_order.display_id::TEXT ILIKE :displayId`, {
              displayId: `${q}`,
            })
          })
        )
      }
    }

    return await draftOrderRepository.findAndCount(query)
  }

  /**
   * Lists draft orders
   * @param selector - query object for find
   * @param config - configurable attributes for find
   * @return list of draft orders
   */
  async list(
    selector,
    config: FindConfig<DraftOrder> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<DraftOrder[]> {
    const manager = this.manager_
    const draftOrderRepo = manager.getCustomRepository(
      this.draftOrderRepository_
    )

    const query = buildQuery(selector, config)

    return await draftOrderRepo.find(query)
  }

  /**
   * Creates a draft order.
   * @param data - data to create draft order from
   * @return the created draft order
   */
  async create(data: AdminPostDraftOrdersReq): Promise<DraftOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const draftOrderRepo = transactionManager.getCustomRepository(
          this.draftOrderRepository_
        )

        if (!data.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `region_id is required to create a draft order`
          )
        }

        if (!data.items || !data.items.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Items are required to create a draft order`
          )
        }

        const { shipping_methods, no_notification_order, items, ...rawCart } =
          data

        if (rawCart.discounts) {
          const { discounts } = rawCart
          rawCart.discounts = []

          for (const { code } of discounts) {
            await this.cartService_
              .withTransaction(transactionManager)
              .applyDiscount(rawCart as Cart, code)
          }
        }

        const createdCart = await this.cartService_
          .withTransaction(transactionManager)
          .create({ type: CartType.DRAFT_ORDER, ...rawCart })

        const draftOrder = draftOrderRepo.create({
          cart_id: createdCart.id,
          no_notification_order,
        })
        const result = await draftOrderRepo.save(draftOrder)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(DraftOrderService.Events.CREATED, {
            id: result.id,
          })

        for (const item of items) {
          if (item.variant_id) {
            const line = await this.lineItemService_
              .withTransaction(transactionManager)
              .generate(item.variant_id, data.region_id, item.quantity, {
                metadata: item?.metadata || {},
                unit_price: item.unit_price,
                cart: createdCart,
              })

            await this.lineItemService_
              .withTransaction(transactionManager)
              .create({
                ...line,
                cart_id: createdCart.id,
              })
          } else {
            let price
            if (typeof item.unit_price === `undefined` || item.unit_price < 0) {
              price = 0
            } else {
              price = item.unit_price
            }

            // custom line items can be added to a draft order
            await this.lineItemService_
              .withTransaction(transactionManager)
              .create({
                cart_id: createdCart.id,
                has_shipping: true,
                title: item.title || "Custom item",
                allow_discounts: false,
                unit_price: price,
                quantity: item.quantity,
              })
          }
        }

        for (const method of shipping_methods) {
          await this.cartService_
            .withTransaction(transactionManager)
            .addShippingMethod(createdCart.id, method.option_id, method.data)
        }

        return result
      }
    )
  }

  /**
   * Registers a draft order as completed, when an order has been completed.
   * @param draftOrderId - id of draft order to complete
   * @param orderId - id of order completed from draft order cart
   * @return the created order
   */
  async registerCartCompletion(
    draftOrderId: string,
    orderId: string
  ): Promise<UpdateResult> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const draftOrderRepo = transactionManager.getCustomRepository(
          this.draftOrderRepository_
        )
        return await draftOrderRepo.update(
          {
            id: draftOrderId,
          },
          {
            status: DraftOrderStatus.COMPLETED,
            completed_at: new Date(),
            order_id: orderId,
          }
        )
      }
    )
  }

  /**
   * Updates a draft order with the given data
   * @param id - id of the draft order
   * @param data - values to update the order with
   * @return the updated draft order
   */
  async update(
    id: string,
    data: { no_notification_order: boolean }
  ): Promise<DraftOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const draftOrderRepo = transactionManager.getCustomRepository(
          this.draftOrderRepository_
        )
        const draftOrder = await this.retrieve(id)

        if (draftOrder.status === DraftOrderStatus.COMPLETED) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Can't update a draft order which is complete"
          )
        }

        let touched = false
        if (data.no_notification_order !== undefined) {
          touched = true
          draftOrder.no_notification_order = data.no_notification_order
        }

        if (touched) {
          await draftOrderRepo.save(draftOrder)

          await this.eventBus_
            .withTransaction(transactionManager)
            .emit(DraftOrderService.Events.UPDATED, {
              id: draftOrder.id,
            })
        }

        return draftOrder
      }
    )
  }
}

export default DraftOrderService
