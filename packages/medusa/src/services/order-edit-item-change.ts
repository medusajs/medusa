import { TransactionBaseService } from "../interfaces"
import { OrderItemChangeRepository } from "../repositories/order-item-change"
import { EntityManager, In } from "typeorm"
import { EventBusService, LineItemService } from "./index"
import { FindConfig, Selector } from "../types/common"
import { OrderItemChange } from "../models"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  manager: EntityManager
  orderItemChangeRepository: typeof OrderItemChangeRepository
  eventBusService: EventBusService
  lineItemService: LineItemService
}

export default class OrderEditItemChangeService extends TransactionBaseService {
  static readonly Events = {
    DELETED: "order-edit-item-change.DELETED",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly orderItemChangeRepository_: typeof OrderItemChangeRepository
  protected readonly eventBus_: EventBusService
  protected readonly lineItemService_: LineItemService

  constructor({
    manager,
    orderItemChangeRepository,
    eventBusService,
    lineItemService,
  }: InjectedDependencies) {
    // @ts-ignore
    super(arguments[0])

    this.manager_ = manager
    this.orderItemChangeRepository_ = orderItemChangeRepository
    this.eventBus_ = eventBusService
    this.lineItemService_ = lineItemService
  }

  protected async retrieve_(
    selector: Selector<OrderItemChange>,
    config: FindConfig<OrderItemChange> = {}
  ): Promise<OrderItemChange> {
    const manager = this.transactionManager_ ?? this.manager_
    const orderItemChangeRepo = manager.getCustomRepository(
      this.orderItemChangeRepository_
    )

    const query = buildQuery(selector, config)
    const itemChange = await orderItemChangeRepo.findOne(query)

    if (!itemChange) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order edit item change with ${selectorConstraints} was not found`
      )
    }

    return itemChange
  }

  async retrieve(
    itemChangeId: string,
    config: FindConfig<OrderItemChange> = {}
  ): Promise<OrderItemChange> {
    return await this.retrieve_({ id: itemChangeId }, config)
  }

  async retrieveItemChangeByOrderEdit(
    itemChangeId: string,
    orderEditId: string,
    config: FindConfig<OrderItemChange> = {}
  ): Promise<OrderItemChange> {
    return await this.retrieve_(
      { id: itemChangeId, order_edit_id: orderEditId },
      config
    )
  }

  async delete(itemChangeIds: string | string[]): Promise<void> {
    itemChangeIds = Array.isArray(itemChangeIds)
      ? itemChangeIds
      : [itemChangeIds]

    return await this.atomicPhase_(async (manager) => {
      const orderItemChangeRepo = manager.getCustomRepository(
        this.orderItemChangeRepository_
      )

      const changes = await orderItemChangeRepo.find({
        where: {
          id: In(itemChangeIds as string[]),
        },
      })

      const lineItemIdsToRemove = changes
        .map((change) => {
          return change.line_item_id
        })
        .filter(Boolean) as string[]

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)
      await Promise.all([
        lineItemIdsToRemove.map((id) => lineItemServiceTx.delete(id)),
      ])

      await orderItemChangeRepo.delete({ id: In(itemChangeIds as string[]) })

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderEditItemChangeService.Events.DELETED, { ids: itemChangeIds })
    })
  }
}
