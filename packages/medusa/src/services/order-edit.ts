import { EntityManager } from "typeorm"
import { FindConfig } from "../types/common"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import { OrderEditRepository } from "../repositories/order-edit"
import {
  LineItem,
  OrderEdit,
  OrderEditItemChangeType,
  OrderEditStatus,
  OrderItemChange,
} from "../models"
import { TransactionBaseService } from "../interfaces"
import { OrderService } from "./index"

type InjectedDependencies = {
  manager: EntityManager
  orderEditRepository: typeof OrderEditRepository
  orderService: OrderService
}

export default class OrderEditService extends TransactionBaseService {
  protected transactionManager_: EntityManager | undefined
  protected readonly manager_: EntityManager
  protected readonly orderEditRepository_: typeof OrderEditRepository
  protected readonly orderService_: OrderService

  constructor({
    manager,
    orderEditRepository,
    orderService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.orderEditRepository_ = orderEditRepository
    this.orderService_ = orderService
  }

  async retrieve(
    orderEditId: string,
    config: FindConfig<OrderEdit> = {}
  ): Promise<OrderEdit | never> {
    const orderEditRepository = this.manager_.getCustomRepository(
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

  async computeLineItems(
    orderEditId: string
  ): Promise<{ items: LineItem[]; removedItems: LineItem[] }> {
    const orderEdit = await this.retrieve(orderEditId, {
      select: ["id", "order_id", "changes", "order"],
      relations: [
        "changes",
        "changes.line_item",
        "changes.original_line_item",
        "order",
        "order.items",
      ],
    })

    const originalItems = orderEdit.order.items
    const removedItems: LineItem[] = []
    const items: LineItem[] = []

    const updatedItems = orderEdit.changes
      .map((itemChange) => {
        if (itemChange.type === OrderEditItemChangeType.ITEM_ADD) {
          items.push(itemChange.line_item as LineItem)
          return
        }

        if (itemChange.type === OrderEditItemChangeType.ITEM_REMOVE) {
          removedItems.push({
            ...itemChange.original_line_item,
            id: itemChange.original_line_item_id,
          } as LineItem)
          return
        }

        return [itemChange.original_line_item_id as string, itemChange]
      })
      .filter((change) => !!change) as [string, OrderItemChange][]

    const orderEditUpdatedChangesMap: Map<string, OrderItemChange> = new Map(
      updatedItems
    )

    originalItems.map((item) => {
      const itemChange = orderEditUpdatedChangesMap.get(item.id)
      if (itemChange) {
        items.push({
          ...itemChange.line_item,
          id: itemChange.original_line_item_id,
        } as LineItem)
      }
    })

    return { items, removedItems }
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

      await orderEditRepo.softRemove(edit)
    })
  }
}
