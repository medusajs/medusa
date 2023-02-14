import {
  CreateSalesChannelInput,
  UpdateSalesChannelInput,
} from "../types/sales-channels"
import { FindConfig, QuerySelector, Selector } from "../types/common"

import { EntityManager } from "typeorm"
import EventBusService from "./event-bus"
import { isDefined, MedusaError } from "medusa-core-utils"
import { SalesChannel } from "../models"
import { SalesChannelRepository } from "../repositories/sales-channel"
import StoreService from "./store"
import { TransactionBaseService } from "../interfaces"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
  storeService: StoreService
}

class SalesChannelService extends TransactionBaseService {
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

  private getManager(): EntityManager {
    return this.transactionManager_ ?? this.manager_
  }

  /**
   * A generic retrieve used to find a sales channel by different attributes.
   *
   * @param selector - SC selector
   * @param config - find config
   * @returns a single SC matching the query or throws
   */
  protected async retrieve_(
    selector: Selector<SalesChannel>,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel> {
    const manager = this.getManager()

    const salesChannelRepo = manager.getCustomRepository(
      this.salesChannelRepository_
    )

    const { relations, ...query } = buildQuery(selector, config)

    const salesChannel = await salesChannelRepo.findOneWithRelations(
      relations as (keyof SalesChannel)[],
      query
    )

    if (!salesChannel) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Sales channel with ${selectorConstraints} was not found`
      )
    }

    return salesChannel
  }

  /**
   * Retrieve a SalesChannel by id
   *
   * @param salesChannelId - id of the channel to retrieve
   * @param config - SC config
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns a sales channel
   */
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel | never> {
    if (!isDefined(salesChannelId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"salesChannelId" must be defined`
      )
    }

    return await this.retrieve_({ id: salesChannelId }, config)
  }

  /**
   * Find a sales channel by name.
   *
   * @param name of the sales channel
   * @param config - find config
   * @return a sales channel with matching name
   */
  async retrieveByName(
    name: string,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel | unknown> {
    if (!isDefined(name)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"name" must be defined`
      )
    }

    return await this.retrieve_({ name }, config)
  }

  /**
   * Lists sales channels based on the provided parameters and includes the count of
   * sales channels that match the query.
   * @return an array containing the sales channels as
   *   the first element and the total count of sales channels that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: QuerySelector<SalesChannel>,
    config: FindConfig<SalesChannel> = {
      skip: 0,
      take: 20,
    }
  ): Promise<[SalesChannel[], number]> {
    const manager = this.getManager()
    const salesChannelRepo = manager.getCustomRepository(
      this.salesChannelRepository_
    )

    const selector_ = { ...selector }
    let q: string | undefined
    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery(selector_, config)

    if (q) {
      return await salesChannelRepo.getFreeTextSearchResultsAndCount(q, query)
    }

    return await salesChannelRepo.findAndCount(query)
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
   */
  async delete(salesChannelId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      const salesChannel = await this.retrieve(salesChannelId, {
        relations: ["locations"],
      }).catch(() => void 0)

      if (!salesChannel) {
        return
      }

      const store = await this.storeService_.retrieve({
        select: ["default_sales_channel_id"],
      })

      if (salesChannel.id === store?.default_sales_channel_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You cannot delete the default sales channel"
        )
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

  /**
   * Retrieves the default sales channel.
   * @return the sales channel
   */
  async retrieveDefault(): Promise<SalesChannel> {
    const manager = this.getManager()

    const store = await this.storeService_.withTransaction(manager).retrieve({
      relations: ["default_sales_channel"],
    })

    if (!store.default_sales_channel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Default Sales channel was not found`
      )
    }

    return store.default_sales_channel
  }

  /**
   * Remove a batch of product from a sales channel
   * @param salesChannelId - The id of the sales channel on which to remove the products
   * @param productIds - The products ids to remove from the sales channel
   * @return the sales channel on which the products have been removed
   */
  async removeProducts(
    salesChannelId: string,
    productIds: string[]
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      await salesChannelRepo.removeProducts(salesChannelId, productIds)

      return await this.retrieve(salesChannelId)
    })
  }

  /**
   * Add a batch of product to a sales channel
   * @param salesChannelId - The id of the sales channel on which to add the products
   * @param productIds - The products ids to attach to the sales channel
   * @return the sales channel on which the products have been added
   */
  async addProducts(
    salesChannelId: string,
    productIds: string[]
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      await salesChannelRepo.addProducts(salesChannelId, productIds)

      return await this.retrieve(salesChannelId)
    })
  }
}

export default SalesChannelService
