import { TransactionBaseService } from "../interfaces"
import { OrderItemChangeRepository } from "../repositories/order-item-change"
import { EntityManager, In } from "typeorm"
import { EventBusService, LineItemService } from "./index"
import { FindConfig } from "../types/common"
import { OrderItemChange } from "../models"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import TaxProviderService from "./tax-provider"

type InjectedDependencies = {
  manager: EntityManager
  orderItemChangeRepository: typeof OrderItemChangeRepository
  eventBusService: EventBusService
  lineItemService: LineItemService
  taxProviderService: TaxProviderService
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
  protected readonly taxProviderService_: TaxProviderService

  constructor({
    manager,
    orderItemChangeRepository,
    eventBusService,
    lineItemService,
    taxProviderService,
  }: InjectedDependencies) {
    // @ts-ignore
    super(arguments[0])

    this.manager_ = manager
    this.orderItemChangeRepository_ = orderItemChangeRepository
    this.eventBus_ = eventBusService
    this.lineItemService_ = lineItemService
    this.taxProviderService_ = taxProviderService
  }

  async retrieve(
    id: string,
    config: FindConfig<OrderItemChange> = {}
  ): Promise<OrderItemChange> {
    const manager = this.transactionManager_ ?? this.manager_
    const orderItemChangeRepo = manager.getCustomRepository(
      this.orderItemChangeRepository_
    )

    const query = buildQuery({ id }, config)
    const itemChange = await orderItemChangeRepo.findOne(query)

    if (!itemChange) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order edit item change ${id} was not found`
      )
    }

    return itemChange
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

      await orderItemChangeRepo.delete({ id: In(itemChangeIds as string[]) })

      const lineItemServiceTx = this.lineItemService_.withTransaction(manager)
      await Promise.all([
        ...lineItemIdsToRemove.map((id) => lineItemServiceTx.delete(id)),
        this.taxProviderService_
          .withTransaction(manager)
          .clearLineItemsTaxLines(lineItemIdsToRemove),
      ])

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderEditItemChangeService.Events.DELETED, { ids: itemChangeIds })
    })
  }
}
