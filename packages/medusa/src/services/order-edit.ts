import { EntityManager } from "typeorm"
import { FindConfig } from "../types/common"
import { buildQuery, isDefined } from "../utils"
import { MedusaError } from "medusa-core-utils"
import { OrderEditRepository } from "../repositories/order-edit"
import {
  LineItem,
  Order,
  OrderEdit,
  OrderEditItemChangeType,
  OrderEditStatus,
} from "../models"
import { TransactionBaseService } from "../interfaces"
import {
  EventBusService,
  LineItemService,
  OrderEditItemChangeService,
  OrderService,
  TotalsService,
} from "./index"
import { CreateOrderEditInput, UpdateOrderEditInput } from "../types/order-edit"

type InjectedDependencies = {
  manager: EntityManager
  orderEditRepository: typeof OrderEditRepository
  orderService: OrderService
  eventBusService: EventBusService
  totalsService: TotalsService
  lineItemService: LineItemService
  orderEditItemChangeService: OrderEditItemChangeService
}

export default class OrderEditService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "order-edit.created",
    UPDATED: "order-edit.updated",
    DECLINED: "order-edit.declined",
  }

  protected transactionManager_: EntityManager | undefined
  protected readonly manager_: EntityManager
  protected readonly orderEditRepository_: typeof OrderEditRepository
  protected readonly orderService_: OrderService
  protected readonly lineItemService_: LineItemService
  protected readonly eventBusService_: EventBusService
  protected readonly totalsService_: TotalsService
  protected readonly orderEditItemChangeService_: OrderEditItemChangeService

  constructor({
    manager,
    orderEditRepository,
    orderService,
    lineItemService,
    eventBusService,
    totalsService,
    orderEditItemChangeService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.orderEditRepository_ = orderEditRepository
    this.orderService_ = orderService
    this.lineItemService_ = lineItemService
    this.eventBusService_ = eventBusService
    this.totalsService_ = totalsService
    this.orderEditItemChangeService_ = orderEditItemChangeService
  }

  async retrieve(
    orderEditId: string,
    config: FindConfig<OrderEdit> = {}
  ): Promise<OrderEdit | never> {
    const manager = this.transactionManager_ ?? this.manager_
    const orderEditRepository = manager.getCustomRepository(
      this.orderEditRepository_
    )
    const { relations, ...query } = buildQuery({ id: orderEditId }, config)

    const orderEdit = await orderEditRepository.findOneWithRelations(
      relations as (keyof OrderEdit)[],
      query
    )

    if (!orderEdit) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order edit with id ${orderEditId} was not found`
      )
    }

    return orderEdit
  }

  protected async retrieveActive(
    orderId: string,
    config: FindConfig<OrderEdit> = {}
  ): Promise<OrderEdit | undefined> {
    const manager = this.transactionManager_ ?? this.manager_
    const orderEditRepository = manager.getCustomRepository(
      this.orderEditRepository_
    )

    const query = buildQuery({ order_id: orderId }, config)
    return await orderEditRepository.findOne(query)
  }

  /**
   * Compute line items across order and order edit
   * - if an item have been removed, it will appear in the removedItems collection and will not appear in the item collection
   * - if an item have been updated, it will appear in the item collection with id being the id of the original item and the rest of the data being the data of the new item generated from the update
   * - if an item have been added, it will appear in the item collection with id being the id of the new item and the rest of the data being the data of the new item generated from the add
   * @param orderEditId
   */
  async computeLineItems(
    orderEditId: string
  ): Promise<{ items: LineItem[]; removedItems: LineItem[] }> {
    const manager = this.transactionManager_ ?? this.manager_

    const lineItemServiceTx = this.lineItemService_.withTransaction(manager)

    const orderEdit = await this.retrieve(orderEditId, {
      select: ["id", "order_id", "changes"],
      relations: ["changes", "changes.original_line_item", "changes.line_item"],
    })

    const items: LineItem[] = []
    const orderEditRemovedItemsMap: Map<string, LineItem> = new Map()
    const orderEditUpdatedItemsMap: Map<string, LineItem> = new Map()

    for (const change of orderEdit.changes) {
      const lineItemId =
        change.type === OrderEditItemChangeType.ITEM_REMOVE
          ? change.original_line_item_id!
          : change.line_item_id!

      const lineItem = await lineItemServiceTx.retrieve(lineItemId!, {
        relations: ["tax_lines", "adjustments"],
      })

      if (change.type === OrderEditItemChangeType.ITEM_REMOVE) {
        orderEditRemovedItemsMap.set(change.original_line_item_id!, lineItem)
        continue
      }

      if (change.type === OrderEditItemChangeType.ITEM_ADD) {
        items.push(lineItem)
        continue
      }

      orderEditUpdatedItemsMap.set(change.original_line_item_id!, {
        ...lineItem,
        id: change.original_line_item_id!,
      } as LineItem)
    }

    const originalLineItems = await this.lineItemService_
      .withTransaction(manager)
      .list(
        {
          order_id: orderEdit.order_id,
        },
        {
          relations: ["tax_lines", "adjustments"],
        }
      )

    for (const originalLineItem of originalLineItems) {
      const itemRemoved = orderEditRemovedItemsMap.get(originalLineItem.id)
      if (itemRemoved) {
        continue
      }

      const updatedLineItem = orderEditUpdatedItemsMap.get(originalLineItem.id)
      const lineItem = updatedLineItem ?? originalLineItem
      items.push(lineItem)
    }

    return { items, removedItems: [...orderEditRemovedItemsMap.values()] }
  }

  /**
   * Compute and return the different totals from the order edit id
   * @param orderEditId
   */
  async getTotals(orderEditId: string): Promise<{
    shipping_total: number
    gift_card_total: number
    gift_card_tax_total: number
    discount_total: number
    tax_total: number | null
    subtotal: number
    total: number
  }> {
    const manager = this.transactionManager_ ?? this.manager_
    const { order_id } = await this.retrieve(orderEditId, {
      select: ["order_id"],
    })
    const order = await this.orderService_
      .withTransaction(manager)
      .retrieve(order_id, {
        relations: [
          "discounts",
          "discounts.rule",
          "gift_cards",
          "region",
          "region.tax_rates",
          "shipping_methods",
          "shipping_methods.tax_lines",
        ],
      })
    const { items } = await this.computeLineItems(orderEditId)
    const computedOrder = { ...order, items } as Order

    const totalsServiceTx = this.totalsService_.withTransaction(manager)

    const shipping_total = await totalsServiceTx.getShippingTotal(computedOrder)
    const { total: gift_card_total, tax_total: gift_card_tax_total } =
      await totalsServiceTx.getGiftCardTotal(computedOrder)
    const discount_total = await totalsServiceTx.getDiscountTotal(computedOrder)
    const tax_total = await totalsServiceTx.getTaxTotal(computedOrder)
    const subtotal = await totalsServiceTx.getSubtotal(computedOrder)
    const total = await totalsServiceTx.getTotal(computedOrder)

    return {
      shipping_total,
      gift_card_total,
      gift_card_tax_total,
      discount_total,
      tax_total,
      subtotal,
      total,
    }
  }

  async create(
    data: CreateOrderEditInput,
    context: { loggedInUserId: string }
  ): Promise<OrderEdit> {
    return await this.atomicPhase_(async (transactionManager) => {
      const activeOrderEdit = await this.retrieveActive(data.order_id)
      if (activeOrderEdit) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An active order edit already exists for the order ${data.order_id}`
        )
      }

      const orderEditRepository = transactionManager.getCustomRepository(
        this.orderEditRepository_
      )

      const orderEditToCreate = orderEditRepository.create({
        order_id: data.order_id,
        internal_note: data.internal_note,
        created_by: context.loggedInUserId,
      })

      const orderEdit = await orderEditRepository.save(orderEditToCreate)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(OrderEditService.Events.CREATED, { id: orderEdit.id })

      return orderEdit
    })
  }

  async update(
    orderEditId: string,
    data: UpdateOrderEditInput
  ): Promise<OrderEdit> {
    return await this.atomicPhase_(async (manager) => {
      const orderEditRepo = manager.getCustomRepository(
        this.orderEditRepository_
      )

      const orderEdit = await this.retrieve(orderEditId)

      for (const key of Object.keys(data)) {
        if (isDefined(data[key])) {
          orderEdit[key] = data[key]
        }
      }

      const result = await orderEditRepo.save(orderEdit)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(OrderEditService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  async delete(orderEditId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const orderEditRepo = manager.getCustomRepository(
        this.orderEditRepository_
      )

      const edit = await orderEditRepo.findOne({ where: { id: orderEditId } })

      if (!edit) {
        return
      }

      if (edit.status !== OrderEditStatus.CREATED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot delete order edit with status ${edit.status}`
        )
      }

      await orderEditRepo.remove(edit)
    })
  }

  async decline(
    orderEditId: string,
    context: {
      declinedReason?: string
      loggedInUser?: string
    }
  ): Promise<OrderEdit> {
    return await this.atomicPhase_(async (manager) => {
      const orderEditRepo = manager.getCustomRepository(
        this.orderEditRepository_
      )

      const { loggedInUser, declinedReason } = context

      const orderEdit = await this.retrieve(orderEditId)

      if (orderEdit.status === OrderEditStatus.DECLINED) {
        return orderEdit
      }

      if (orderEdit.status !== OrderEditStatus.REQUESTED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot decline an order edit with status ${orderEdit.status}.`
        )
      }

      orderEdit.declined_at = new Date()
      orderEdit.declined_by = loggedInUser
      orderEdit.declined_reason = declinedReason

      const result = await orderEditRepo.save(orderEdit)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(OrderEditService.Events.DECLINED, {
          id: result.id,
        })

      return result
    })
  }

  async decorateLineItemsAndTotals(orderEdit: OrderEdit): Promise<OrderEdit> {
    const lineItemDecoratedOrderEdit = await this.decorateLineItems(orderEdit)
    return await this.decorateTotals(lineItemDecoratedOrderEdit)
  }

  async decorateLineItems(orderEdit: OrderEdit): Promise<OrderEdit> {
    const { items, removedItems } = await this.computeLineItems(orderEdit.id)
    orderEdit.items = items
    orderEdit.removed_items = removedItems

    return orderEdit
  }

  async decorateTotals(orderEdit: OrderEdit): Promise<OrderEdit> {
    const totals = await this.getTotals(orderEdit.id)
    orderEdit.discount_total = totals.discount_total
    orderEdit.gift_card_total = totals.gift_card_total
    orderEdit.gift_card_tax_total = totals.gift_card_tax_total
    orderEdit.shipping_total = totals.shipping_total
    orderEdit.subtotal = totals.subtotal
    orderEdit.tax_total = totals.tax_total
    orderEdit.total = totals.total

    return orderEdit
  }

  async deleteItemChange(
    orderEditId: string,
    itemChangeId: string
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const itemChange = await this.orderEditItemChangeService_.retrieve(
        itemChangeId,
        { select: ["id", "order_edit_id"] }
      )

      const orderEdit = await this.retrieve(orderEditId, {
        select: ["id", "confirmed_at", "canceled_at"],
      })

      if (orderEdit.id !== itemChange.order_edit_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The item change you are trying to delete doesn't belong to the OrderEdit with id: ${orderEditId}.`
        )
      }

      if (orderEdit.confirmed_at !== null || orderEdit.canceled_at !== null) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot delete and item change from a ${orderEdit.status} order edit`
        )
      }

      return await this.orderEditItemChangeService_.delete(itemChangeId)
    })
  }
}
