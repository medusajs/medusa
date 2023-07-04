import { MedusaError } from "medusa-core-utils"
import {
  EntityManager,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  Raw,
  UpdateResult,
} from "typeorm"
import { TransactionBaseService } from "../interfaces"
import {
  CartType,
  DraftOrder,
  DraftOrderStatus,
  LineItem,
  ShippingMethod,
} from "../models"
import { DraftOrderRepository } from "../repositories/draft-order"
import { OrderRepository } from "../repositories/order"
import { PaymentRepository } from "../repositories/payment"
import { FindConfig } from "../types/common"
import { DraftOrderCreateProps } from "../types/draft-orders"
import { GenerateInputData } from "../types/line-item"
import { buildQuery } from "../utils"
import CartService from "./cart"
import CustomShippingOptionService from "./custom-shipping-option"
import EventBusService from "./event-bus"
import LineItemService from "./line-item"
import ProductVariantService from "./product-variant"
import ShippingOptionService from "./shipping-option"
import { isDefined } from "@medusajs/utils"

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
  customShippingOptionService: CustomShippingOptionService
}

/**
 * Handles draft orders
 * @implements {BaseService}
 */
class DraftOrderService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "draft_order.created",
    UPDATED: "draft_order.updated",
  }

  protected readonly draftOrderRepository_: typeof DraftOrderRepository
  protected readonly paymentRepository_: typeof PaymentRepository
  protected readonly orderRepository_: typeof OrderRepository
  protected readonly eventBus_: EventBusService
  protected readonly cartService_: CartService
  protected readonly lineItemService_: LineItemService
  protected readonly productVariantService_: ProductVariantService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly customShippingOptionService_: CustomShippingOptionService

  constructor({
    draftOrderRepository,
    paymentRepository,
    orderRepository,
    eventBusService,
    cartService,
    lineItemService,
    productVariantService,
    shippingOptionService,
    customShippingOptionService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.draftOrderRepository_ = draftOrderRepository
    this.paymentRepository_ = paymentRepository
    this.orderRepository_ = orderRepository
    this.lineItemService_ = lineItemService
    this.cartService_ = cartService
    this.productVariantService_ = productVariantService
    this.shippingOptionService_ = shippingOptionService
    this.customShippingOptionService_ = customShippingOptionService
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a draft order with the given id.
   * @param draftOrderId - id of the draft order to retrieve
   * @param config - query object for findOne
   * @return the draft order
   */
  async retrieve(
    draftOrderId: string,
    config: FindConfig<DraftOrder> = {}
  ): Promise<DraftOrder | never> {
    if (!isDefined(draftOrderId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"draftOrderId" must be defined`
      )
    }

    const draftOrderRepo = this.activeManager_.withRepository(
      this.draftOrderRepository_
    )

    const query = buildQuery({ id: draftOrderId }, config)
    const draftOrder = await draftOrderRepo.findOne(query)
    if (!draftOrder) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Draft order with ${draftOrderId} was not found`
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
    const draftOrderRepo = this.activeManager_.withRepository(
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
        const draftOrderRepo = transactionManager.withRepository(
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
    const draftOrderRepository = this.activeManager_.withRepository(
      this.draftOrderRepository_
    )

    const { q, ...restSelector } = selector
    const query = buildQuery(restSelector, config)

    if (q) {
      query.where = query.where as FindOptionsWhere<DraftOrder>
      delete query.where?.display_id

      query.relations = query.relations ?? {}
      query.relations.cart = query.relations.cart ?? true

      const innerJoinLikeConstraint = {
        cart: {
          id: Not(IsNull()),
        },
      }

      query.where = query.where as FindOptionsWhere<DraftOrder>[]
      query.where = [
        {
          ...query.where,
          ...innerJoinLikeConstraint,
          cart: {
            ...innerJoinLikeConstraint.cart,
            id: Not(IsNull()),
            email: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraint,
          display_id: Raw((alias) => `CAST(${alias} as varchar) ILike :q`, {
            q: `%${q}%`,
          }),
        },
      ]
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
    const draftOrderRepo = this.activeManager_.withRepository(
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
  async create(data: DraftOrderCreateProps): Promise<DraftOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const draftOrderRepo = transactionManager.withRepository(
          this.draftOrderRepository_
        )

        if (!data.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `region_id is required to create a draft order`
          )
        }

        const {
          shipping_methods,
          no_notification_order,
          items,
          idempotency_key,
          discounts,
          ...rawCart
        } = data

        const cartServiceTx =
          this.cartService_.withTransaction(transactionManager)

        let createdCart = await cartServiceTx.create({
          type: CartType.DRAFT_ORDER,
          ...rawCart,
        })

        const draftOrder = draftOrderRepo.create({
          cart_id: createdCart.id,
          no_notification_order,
          idempotency_key,
        })

        const result = await draftOrderRepo.save(draftOrder)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(DraftOrderService.Events.CREATED, {
            id: result.id,
          })

        const lineItemServiceTx =
          this.lineItemService_.withTransaction(transactionManager)

        const itemsToGenerate: GenerateInputData[] = []
        const itemsToCreate: Partial<LineItem>[] = []

        // prepare that for next steps
        ;(items ?? []).forEach((item) => {
          if (item.variant_id) {
            itemsToGenerate.push({
              variantId: item.variant_id,
              quantity: item.quantity,
              metadata: item.metadata,
              unit_price: item.unit_price,
            })
            return
          }

          let price
          if (!isDefined(item.unit_price) || item.unit_price < 0) {
            price = 0
          } else {
            price = item.unit_price
          }

          itemsToCreate.push({
            cart_id: createdCart.id,
            has_shipping: true,
            title: item.title || "Custom item",
            allow_discounts: false,
            unit_price: price,
            quantity: item.quantity,
          })
        })

        const promises: Promise<any>[] = []

        // generate line item link to a variant
        if (itemsToGenerate.length) {
          const generatedLines = await lineItemServiceTx.generate(
            itemsToGenerate,
            {
              region_id: data.region_id,
            }
          )

          const toCreate = generatedLines.map((line) => ({
            ...line,
            cart_id: createdCart.id,
          }))

          promises.push(lineItemServiceTx.create(toCreate))
        }

        // custom line items can be added to a draft order
        if (itemsToCreate.length) {
          promises.push(lineItemServiceTx.create(itemsToCreate))
        }

        const shippingMethodToCreate: Partial<ShippingMethod>[] = []

        shipping_methods.forEach((method) => {
          if (isDefined(method.price)) {
            shippingMethodToCreate.push({
              shipping_option_id: method.option_id,
              cart_id: createdCart.id,
              price: method.price,
            })
            return
          }
        })

        if (shippingMethodToCreate.length) {
          await this.customShippingOptionService_
            .withTransaction(transactionManager)
            .create(shippingMethodToCreate)
        }

        createdCart = await cartServiceTx.retrieveWithTotals(createdCart.id, {
          relations: [
            "shipping_methods",
            "shipping_methods.shipping_option",
            "items",
            "items.variant",
            "items.variant.product",
            "payment_sessions",
          ],
        })

        shipping_methods.forEach((method) => {
          promises.push(
            cartServiceTx.addShippingMethod(
              createdCart,
              method.option_id,
              method.data
            )
          )
        })

        await Promise.all(promises)

        if (discounts?.length) {
          await cartServiceTx.update(createdCart.id, { discounts })
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
        const draftOrderRepo = transactionManager.withRepository(
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
        const draftOrderRepo = transactionManager.withRepository(
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
