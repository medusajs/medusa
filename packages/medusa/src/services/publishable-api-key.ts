import { EntityManager } from "typeorm"

import { PublishableApiKeyRepository } from "../repositories/publishable-api-key"
import { TransactionBaseService } from "../interfaces"
import EventBusService from "./event-bus"
import { PublishableApiKey } from "../models/publishable-api-key"
import { FindConfig, Selector } from "../types/common"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  manager: EntityManager

  eventBusService: EventBusService
  publishableApiKeyRepository: typeof PublishableApiKeyRepository
}

/**
 * A service for PublishableApiKey business logic.
 */
class PublishableApiKeyService extends TransactionBaseService {
  static Events = {
    CREATED: "publishable_api_key.created",
    REVOKED: "publishable_api_key.revoked",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBusService_: EventBusService
  protected readonly publishableApiKeyRepository_: typeof PublishableApiKeyRepository

  constructor({
    manager,
    eventBusService,
    publishableApiKeyRepository,
  }: InjectedDependencies) {
    // @ts-ignore
    super(arguments[0])

    this.manager_ = manager
    this.eventBusService_ = eventBusService
    this.publishableApiKeyRepository_ = publishableApiKeyRepository
  }

  /**
   * Create a PublishableApiKey record.
   *
   * @params context - key creation context object
   */
  async create(context: {
    loggedInUserId: string
  }): Promise<PublishableApiKey | never> {
    return await this.atomicPhase_(async (manager) => {
      const publishableApiKeyRepo = manager.getCustomRepository(
        this.publishableApiKeyRepository_
      )

      const publishableApiKey = publishableApiKeyRepo.create({
        created_by: context.loggedInUserId,
      })

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PublishableApiKeyService.Events.CREATED, {
          id: publishableApiKey.id,
        })

      return await publishableApiKeyRepo.save(publishableApiKey)
    })
  }

  /**
   * Retrieves a PublishableApiKey by id
   *
   * @param publishableApiKeyId - id of the key
   * @param config - a find config object
   */
  async retrieve(
    publishableApiKeyId: string,
    config: FindConfig<PublishableApiKey | never>
  ): Promise<PublishableApiKey> {
    return await this.retrieve_({ id: publishableApiKeyId }, config)
  }

  /**
   * Generic retrieve for selecting PublishableApiKEys by different attributes.
   *
   * @param selector - a PublishableApiKey selector object
   * @param config - a find config object
   */
  protected async retrieve_(
    selector: Selector<PublishableApiKey>,
    config: FindConfig<PublishableApiKey> = {}
  ): Promise<PublishableApiKey> {
    const repo = this.manager_.getCustomRepository(
      this.publishableApiKeyRepository_
    )
    const { relations, ...query } = buildQuery(selector, config)
    const publishableApiKey = await repo.findOneWithRelations(
      relations as (keyof PublishableApiKey)[],
      query
    )

    if (!publishableApiKey) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `PublishableApiKey was not found`
      )
    }

    return publishableApiKey
  }
}

export default PublishableApiKeyService
