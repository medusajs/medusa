import { MedusaError } from "medusa-core-utils"
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
import StoreService from "./store"

type InjectedDependencies = {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
  storeService: StoreService
}

class SalesChannelService extends TransactionBaseService<SalesChannelService> {
  static Events = {
    UPDATED: "sales_channel.updated",
    CREATED: "sales_channel.created",
    DELETED: "sales_channel.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelRepository_: typeof SalesChannelRepository
  protected readonly eventBusService_: EventBusService
  protected readonly storeService_: StoreService

  constructor({
    salesChannelRepository,
    eventBusService,
    manager,
    storeService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.salesChannelRepository_ = salesChannelRepository
    this.eventBusService_ = eventBusService
    this.storeService_ = storeService
  }

  /**
   * Retrieve a SalesChannel by id
   *
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns a sales channel
   */
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
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

  /**
   * Creates a SalesChannel
   *
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns the created channel
   */
  async create(data: CreateSalesChannelInput): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (manager) => {
      const salesChannelRepo: SalesChannelRepository =
        manager.getCustomRepository(this.salesChannelRepository_)

      const salesChannel = salesChannelRepo.create(data)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(SalesChannelService.Events.CREATED, {
          id: salesChannel.id,
        })

      return await salesChannelRepo.save(salesChannel)
    })
  }

  async update(
    salesChannelId: string,
    data: UpdateSalesChannelInput
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo: SalesChannelRepository =
        transactionManager.getCustomRepository(this.salesChannelRepository_)

      const salesChannel = await this.retrieve(salesChannelId)

      for (const key of Object.keys(data)) {
        if (typeof data[key] !== `undefined`) {
          salesChannel[key] = data[key]
        }
      }

      const result = await salesChannelRepo.save(salesChannel)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(SalesChannelService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Deletes a sales channel from
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @param salesChannelId - the id of the sales channel to delete
   * @return Promise<void>
   */
  async delete(salesChannelId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      const salesChannel = await this.retrieve(salesChannelId).catch(
        () => void 0
      )

      if (!salesChannel) {
        return
      }

      await salesChannelRepo.softRemove(salesChannel)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(SalesChannelService.Events.DELETED, {
          id: salesChannelId,
        })
    })
  }

  /**
   * Creates a default sales channel, if this does not already exist.
   * @return the sales channel
   */
  async createDefault(): Promise<SalesChannel> {
    return this.atomicPhase_(async (transactionManager) => {
      const store = await this.storeService_
        .withTransaction(transactionManager)
        .retrieve({
          relations: ["default_sales_channel"],
        })

      if (store.default_sales_channel_id) {
        return store.default_sales_channel
      }

      const defaultSalesChannel = await this.create({
        description: "Created by Medusa",
        name: "Default Sales Channel",
        is_disabled: false,
      })

      await this.storeService_.withTransaction(transactionManager).update({
        default_sales_channel_id: defaultSalesChannel.id,
      })

      return defaultSalesChannel
    })
  }
}

export default SalesChannelService
