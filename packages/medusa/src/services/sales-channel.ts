import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { SalesChannel } from "../models"
import { SalesChannelRepository } from "../repositories/sales-channel"
import { FindConfig, QuerySelector } from "../types/common"
import {
  CreateSalesChannelInput,
  UpdateSalesChannelInput,
} from "../types/sales-channels"
import EventBusService from "./event-bus"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
}

class SalesChannelService extends TransactionBaseService<SalesChannelService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelRepository_: typeof SalesChannelRepository
  protected readonly eventBusService_: EventBusService

  constructor({
    salesChannelRepository,
    eventBusService,
    manager,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.salesChannelRepository_ = salesChannelRepository
    this.eventBusService_ = eventBusService
  }

  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (manager) => {
      const salesChannelRepo = manager.getCustomRepository(
        this.salesChannelRepository_
      )

      const query = buildQuery(
        {
          id: salesChannelId,
        },
        config
      )

      const salesChannel = await salesChannelRepo.findOne(query)

      if (!salesChannel) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Sales channel with id ${salesChannelId} was not found`
        )
      }

      return salesChannel
    })
  }

  async listAndCount(
    selector: QuerySelector<any> = {},
    config: FindConfig<any> = { relations: [], skip: 0, take: 10 }
  ): Promise<[SalesChannel[], number]> {
    throw new Error("Method not implemented.")
  }

  async create(data: CreateSalesChannelInput): Promise<SalesChannel> {
    throw new Error("Method not implemented.")
  }

  async update(
    id: string,
    data: UpdateSalesChannelInput
  ): Promise<SalesChannel> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default SalesChannelService
